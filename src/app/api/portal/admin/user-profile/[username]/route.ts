import { NextRequest, NextResponse } from "next/server";
import { getPortalAuthFromRequest } from "@/lib/portal-auth";
import prisma from "@/lib/prisma";
import { stat } from "fs/promises";
import path from "path";
import { getPublicFileUrl } from "@/lib/file-url-helper";

const toIstDateKey = (date: Date) => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(date);
};

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ username: string }> }
) {
  try {
    const decoded = getPortalAuthFromRequest(req);
    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { username: rawUsername } = await context.params;
    const username = rawUsername?.toLowerCase();
    if (!username) {
      return NextResponse.json({ error: "Username required" }, { status: 400 });
    }

    const profile = await (prisma as any).userProfile.findFirst({
      where: { username },
      include: {
        skills: true,
        experiences: true,
        educations: true,
        certifications: true,
        projects: true,
        courses: true,
        languages: true,
        user: true,
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Portal Admin access — no publicProfileEnabled check
    const oneYearAgo = new Date();
    oneYearAgo.setDate(oneYearAgo.getDate() - 365);

    const sessions = await prisma.session.findMany({
      where: { userId: profile.userId, startTime: { gte: oneYearAgo } },
      select: { startTime: true },
    });

    const activity: Record<string, number> = {};
    sessions.forEach((s) => {
      const key = toIstDateKey(s.startTime);
      activity[key] = (activity[key] || 0) + 1;
    });

    const resumes = await (prisma as any).resume.findMany({
      where: { userId: profile.userId },
      orderBy: { uploadedAt: "desc" },
      take: 5,
    });

    const resumesWithSize = await Promise.all(
      resumes.map(async (resume: any) => {
        let fileSize: number | null = null;
        const publicUrl = await getPublicFileUrl(resume.fileUrl, { usePublicCDN: true });
        if (resume.fileUrl && resume.fileUrl.startsWith("/")) {
          try {
            const localPath = path.join(process.cwd(), "public", resume.fileUrl.replace(/^\/+/, ""));
            const stats = await stat(localPath);
            fileSize = stats.size;
          } catch {
            fileSize = null;
          }
        }
        return { id: resume.id, fileName: resume.fileName, fileUrl: publicUrl, uploadedAt: resume.uploadedAt, fileSize };
      })
    );

    const certificationsWithUrls = await Promise.all(
      profile.certifications.map(async (cert: any) => {
        const imageUrl = cert.imageUrl ? await getPublicFileUrl(cert.imageUrl, { usePublicCDN: true }) : null;
        const credentialUrl = cert.credentialUrl ? await getPublicFileUrl(cert.credentialUrl, { usePublicCDN: true }) : null;
        return { ...cert, imageUrl, credentialUrl };
      })
    );

    return NextResponse.json({
      publicProfileEnabled: profile.publicProfileEnabled,
      profile: {
        username: profile.username,
        headline: profile.headline,
        bio: profile.bio,
        openToWork: profile.openToWork,
        user: {
          name: profile.user.name,
          email: profile.user.email,
          image: profile.user.avatar,
        },
        socialLinks: (profile as any).socialLinks || null,
        publicSections: {
          skills: true,
          experience: true,
          education: true,
          certifications: true,
          projects: true,
          courses: true,
          languages: true,
          analyticsReport: false,
        },
      },
      sections: {
        skills: profile.skills,
        experiences: profile.experiences,
        educations: profile.educations,
        certifications: certificationsWithUrls,
        projects: profile.projects,
        courses: profile.courses,
        languages: profile.languages,
      },
      activity,
      resumes: resumesWithSize,
    });
  } catch (error) {
    console.error("Portal admin user-profile error:", error);
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}
