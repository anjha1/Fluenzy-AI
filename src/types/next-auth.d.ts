import { Role, Plan } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      avatar?: string;
      plan: Plan;
      usageCount: number;
      usageLimit: number;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    plan: Plan;
    usageCount: number;
    usageLimit: number;
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    plan: Plan;
    usageCount: number;
    usageLimit: number;
    role: Role;
  }
}