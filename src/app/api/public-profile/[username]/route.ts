import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
  try {
    const username = params.username?.toLowerCase();
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

    if (!profile || !profile.publicProfileEnabled) {
      return NextResponse.json({ error: "Profile not public" }, { status: 404 });
    }

    const allowed = (profile.publicSections as any) || {
      skills: true,
      experience: true,
      education: true,
      certifications: true,
      projects: true,
      courses: true,
      languages: true,
    };

    return NextResponse.json({
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
      },
      sections: {
        skills: allowed.skills ? profile.skills : [],
        experiences: allowed.experience ? profile.experiences : [],
        educations: allowed.education ? profile.educations : [],
        certifications: allowed.certifications ? profile.certifications : [],
        projects: allowed.projects ? profile.projects : [],
        courses: allowed.courses ? profile.courses : [],
        languages: allowed.languages ? profile.languages : [],
      },
    });
  } catch (error) {
    console.error("Public profile error:", error);
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}
