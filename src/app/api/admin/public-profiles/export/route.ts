import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

function csvEscape(value: string | null | undefined): string {
  if (value == null) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role as any) !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const profiles = await (prisma as any).userProfile.findMany({
      where: {
        publicProfileEnabled: true,
        user: { role: "User" },
      },
      include: {
        user: { select: { name: true } },
        skills: { select: { name: true } },
        experiences: { select: { role: true, company: true } },
        educations: { select: { degree: true, institution: true } },
        certifications: { select: { name: true } },
        projects: { select: { title: true } },
        courses: { select: { name: true } },
        languages: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const headers = [
      "Full Name",
      "Username",
      "Headline",
      "About",
      "Skills",
      "Experience",
      "Education",
      "Certifications",
      "Projects",
      "Courses",
      "Languages",
      "Portfolio",
      "GitHub",
      "LinkedIn",
      "LeetCode",
      "Profile URL",
      "Profile Visibility",
    ];

    const rows = profiles.map((p: any) => {
      const social = (p.socialLinks as any) || {};
      return [
        csvEscape(p.user?.name),
        csvEscape(p.username),
        csvEscape(p.headline),
        csvEscape(p.bio),
        csvEscape(p.skills.map((s: any) => s.name).join("; ")),
        csvEscape(p.experiences.map((e: any) => `${e.role} at ${e.company}`).join("; ")),
        csvEscape(p.educations.map((e: any) => `${e.degree} – ${e.institution}`).join("; ")),
        csvEscape(p.certifications.map((c: any) => c.name).join("; ")),
        csvEscape(p.projects.map((pr: any) => pr.title).join("; ")),
        csvEscape(p.courses.map((c: any) => c.name).join("; ")),
        csvEscape(p.languages.map((l: any) => l.name).join("; ")),
        csvEscape(social.portfolio),
        csvEscape(social.github),
        csvEscape(social.linkedin),
        csvEscape(social.leetcode),
        csvEscape(`https://fluenzyai.app/u/${p.username}`),
        "Public",
      ].join(",");
    });

    const csv = "\uFEFF" + [headers.join(","), ...rows].join("\n"); // UTF-8 BOM for Excel compatibility
    const date = new Date().toISOString().split("T")[0];
    const filename = `fluenzy-public-students-${date}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("CSV export error:", error);
    return NextResponse.json({ error: "Failed to export CSV" }, { status: 500 });
  }
}
