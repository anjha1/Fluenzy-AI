import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

const getProfile = async (email: string) => {
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) return null;
  const profile = await (prisma as any).userProfile.findUnique({ where: { userId: user.id } });
  return { user, profile };
};

const typeMap = {
  skill: "skill",
  experience: "experience",
  education: "education",
  certification: "certification",
  project: "project",
  course: "course",
  language: "language",
} as const;

const normalizeUrl = (value?: string) => {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

type SectionType = keyof typeof typeMap;

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, data } = body as { type: SectionType; data: any };
    if (!type || !typeMap[type]) {
      return NextResponse.json({ error: "Invalid section type" }, { status: 400 });
    }

    const profileData = await getProfile(session.user.email);
    if (!profileData?.profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const profileId = profileData.profile.id;

    switch (type) {
      case "skill":
        return NextResponse.json(
          await (prisma as any).skill.create({
            data: {
              profileId,
              name: data.name,
              level: data.level,
            },
          })
        );
      case "experience":
        return NextResponse.json(
          await (prisma as any).experience.create({
            data: {
              profileId,
              role: data.role,
              company: data.company,
              startDate: new Date(data.startDate),
              endDate: data.endDate ? new Date(data.endDate) : null,
              description: data.description || "",
            },
          })
        );
      case "education":
        return NextResponse.json(
          await (prisma as any).education.create({
            data: {
              profileId,
              degree: data.degree,
              institution: data.institution,
              startYear: Number(data.startYear),
              endYear: data.endYear ? Number(data.endYear) : null,
              grade: data.grade || "",
            },
          })
        );
      case "certification":
        return NextResponse.json(
          await (prisma as any).certification.create({
            data: {
              profileId,
              name: data.name,
              issuer: data.issuer,
              issueDate: new Date(data.issueDate),
              credentialUrl: normalizeUrl(data.credentialUrl),
              skills: Array.isArray(data.skills) ? data.skills : [],
            },
          })
        );
      case "project":
        return NextResponse.json(
          await (prisma as any).project.create({
            data: {
              profileId,
              title: data.title,
              description: data.description || "",
              techStack: data.techStack || "",
              projectUrl: data.projectUrl || "",
              repoUrl: data.repoUrl || "",
            },
          })
        );
      case "course":
        return NextResponse.json(
          await (prisma as any).course.create({
            data: {
              profileId,
              name: data.name,
              platform: data.platform,
              status: data.status,
            },
          })
        );
      case "language":
        return NextResponse.json(
          await (prisma as any).language.create({
            data: {
              profileId,
              name: data.name,
              proficiency: data.proficiency,
            },
          })
        );
      default:
        return NextResponse.json({ error: "Unsupported section" }, { status: 400 });
    }
  } catch (error) {
    console.error("Profile section create error:", error);
    return NextResponse.json({ error: "Failed to create section" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, id, data } = body as { type: SectionType; id: string; data: any };
    if (!type || !id || !typeMap[type]) {
      return NextResponse.json({ error: "Invalid section update" }, { status: 400 });
    }

    const profileData = await getProfile(session.user.email);
    if (!profileData?.profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const profileId = profileData.profile.id;

    switch (type) {
      case "skill":
        await (prisma as any).skill.updateMany({
          where: { id, profileId },
          data: { name: data.name, level: data.level },
        });
        return NextResponse.json({ success: true });
      case "experience":
        await (prisma as any).experience.updateMany({
          where: { id, profileId },
          data: {
            role: data.role,
            company: data.company,
            startDate: new Date(data.startDate),
            endDate: data.endDate ? new Date(data.endDate) : null,
            description: data.description || "",
          },
        });
        return NextResponse.json({ success: true });
      case "education":
        await (prisma as any).education.updateMany({
          where: { id, profileId },
          data: {
            degree: data.degree,
            institution: data.institution,
            startYear: Number(data.startYear),
            endYear: data.endYear ? Number(data.endYear) : null,
            grade: data.grade || "",
          },
        });
        return NextResponse.json({ success: true });
      case "certification":
        await (prisma as any).certification.updateMany({
          where: { id, profileId },
          data: {
            name: data.name,
            issuer: data.issuer,
            issueDate: new Date(data.issueDate),
            credentialUrl: normalizeUrl(data.credentialUrl),
            skills: Array.isArray(data.skills) ? data.skills : [],
          },
        });
        return NextResponse.json({ success: true });
      case "project":
        await (prisma as any).project.updateMany({
          where: { id, profileId },
          data: {
            title: data.title,
            description: data.description || "",
            techStack: data.techStack || "",
            projectUrl: data.projectUrl || "",
            repoUrl: data.repoUrl || "",
          },
        });
        return NextResponse.json({ success: true });
      case "course":
        await (prisma as any).course.updateMany({
          where: { id, profileId },
          data: {
            name: data.name,
            platform: data.platform,
            status: data.status,
          },
        });
        return NextResponse.json({ success: true });
      case "language":
        await (prisma as any).language.updateMany({
          where: { id, profileId },
          data: {
            name: data.name,
            proficiency: data.proficiency,
          },
        });
        return NextResponse.json({ success: true });
      default:
        return NextResponse.json({ error: "Unsupported section" }, { status: 400 });
    }
  } catch (error) {
    console.error("Profile section update error:", error);
    return NextResponse.json({ error: "Failed to update section" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, id } = body as { type: SectionType; id: string };
    if (!type || !id || !typeMap[type]) {
      return NextResponse.json({ error: "Invalid section delete" }, { status: 400 });
    }

    const profileData = await getProfile(session.user.email);
    if (!profileData?.profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const profileId = profileData.profile.id;

    switch (type) {
      case "skill":
        await (prisma as any).skill.deleteMany({ where: { id, profileId } });
        break;
      case "experience":
        await (prisma as any).experience.deleteMany({ where: { id, profileId } });
        break;
      case "education":
        await (prisma as any).education.deleteMany({ where: { id, profileId } });
        break;
      case "certification":
        await (prisma as any).certification.deleteMany({ where: { id, profileId } });
        break;
      case "project":
        await (prisma as any).project.deleteMany({ where: { id, profileId } });
        break;
      case "course":
        await (prisma as any).course.deleteMany({ where: { id, profileId } });
        break;
      case "language":
        await (prisma as any).language.deleteMany({ where: { id, profileId } });
        break;
      default:
        return NextResponse.json({ error: "Unsupported section" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profile section delete error:", error);
    return NextResponse.json({ error: "Failed to delete section" }, { status: 500 });
  }
}
