import { Plan, Role } from "@prisma/client";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

// Function to parse user agent
function parseUserAgent(userAgent: string) {
  const ua = userAgent.toLowerCase();
  let deviceType = 'Desktop';
  let os = 'Unknown';
  let browser = 'Unknown';

  if (/mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    deviceType = /ipad|tablet/i.test(ua) ? 'Tablet' : 'Mobile';
  }

  if (/windows/i.test(ua)) os = 'Windows';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/linux/i.test(ua)) os = 'Linux';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';

  if (/chrome/i.test(ua) && !/edg/i.test(ua)) browser = 'Chrome';
  else if (/firefox/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
  else if (/edg/i.test(ua)) browser = 'Edge';

  return { deviceType, os, browser };
}

const common = async ({
  email,
  name,
  avatar,
  plan,
  usageCount,
  usageLimit,
}: {
  email: string;
  name: string;
  avatar: string;
  plan: Plan;
  usageCount: number;
  usageLimit: number;
}) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      const user = await prisma.users.create({
        data: {
          email,
          name,
          avatar,
          plan,
          usageCount,
          usageLimit,
          role: 'User', // Default to User, SUPER_ADMIN created via script
        },
      });
      return user;
    } else {
      return user;
    }
  } catch (error) {
    console.log(error);
  }
};

// Environment Variable Validation
const requiredEnvVars = [
  'NEXTAUTH_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'DATABASE_URL'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`CRITICAL ERROR: Environment variable ${varName} is missing. NextAuth will not function correctly.`);
  }
});

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const user = await prisma.users.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !(user as any).password) {
          return null;
        }
        const isPasswordValid = await bcrypt.compare(credentials.password, (user as any).password);
        if (!isPasswordValid) {
          return null;
        }
        const dbUser = await prisma.users.findUnique({
          where: { email: user.email },
        });
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar,
          plan: dbUser?.plan || "Free",
          usageCount: dbUser?.usageCount || 0,
          usageLimit: dbUser?.usageLimit || 3,
          role: dbUser?.role || "User",
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'missing',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'missing',
      profile: async (profile) => {
        const user = await common({
          email: profile?.email!,
          name: profile.name!,
          avatar: profile.picture!,
          plan: "Free",
          usageCount: 0,
          usageLimit: 3,
        });
        if (!user) throw new Error("User creation failed");
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar,
          plan: user.plan,
          usageCount: user.usageCount,
          usageLimit: user.usageLimit,
          role: user.role,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // JWT callback to add custom fields to the token
    async jwt({ token, user }: { token: any; user: any }) {
      // Always fetch fresh user data from database
      const dbUser = await prisma.users.findUnique({
        where: { email: token.email },
      });
      if (dbUser) {
        token.id = dbUser.id;
        token.email = dbUser.email;
        token.avatar = dbUser.avatar;
        token.plan = dbUser.plan;
        token.usageCount = dbUser.usageCount;
        token.usageLimit = dbUser.usageLimit;
        token.role = dbUser.role;
      } else {
        token.plan = "Free";
        token.usageCount = 0;
        token.usageLimit = 3;
        token.role = "User";
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      // Fetch fresh user data from database
      const dbUser = await prisma.users.findUnique({
        where: { email: token.email },
      });
      if (dbUser) {
        session.user.id = token.id;
        session.user.email = dbUser.email;
        session.user.avatar = dbUser.avatar;
        session.user.plan = dbUser.plan;
        session.user.usageCount = dbUser.usageCount;
        session.user.usageLimit = dbUser.usageLimit;
        session.user.role = dbUser.role;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // Log login
      if (user?.id) {
        const req = (global as any).req; // Need to get request from somewhere
        // Actually, in NextAuth, events don't have req, but we can use headers from session or something.
        // For simplicity, log basic info, and update with device later if possible.
        // Since it's JWT, perhaps store in token or use middleware.

        // For now, create log with basic info
        await (prisma as any).userLoginLog.create({
          data: {
            userId: user.id,
            loginTime: new Date(),
            status: 'success',
            // ip, location, deviceType, os, browser will be updated later
          },
        });
      }
    },
    async signOut({ session, token }) {
      // Log logout
      if (token?.sub) {
        // Find the latest login log without logoutTime
        const latestLog = await (prisma as any).userLoginLog.findFirst({
          where: {
            userId: token.sub,
            logoutTime: null,
          },
          orderBy: {
            loginTime: 'desc',
          },
        });
        if (latestLog) {
          const logoutTime = new Date();
          const duration = Math.floor((logoutTime.getTime() - latestLog.loginTime.getTime()) / 1000);
          await (prisma as any).userLoginLog.update({
            where: { id: latestLog.id },
            data: {
              logoutTime,
              sessionDuration: duration,
            },
          });
        }
      }
    },
  },
  pages: {
    signIn: "/",
    signOut: "/",
  },
};
