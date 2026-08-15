import { NextRequest, NextResponse } from "next/server";
import { getPortalAuthFromRequest } from "@/lib/portal-auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const decoded = getPortalAuthFromRequest(req);
    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const search = searchParams.get("search")?.trim() || "";

    const where: any = {
      publicProfileEnabled: true,
      user: { role: "User" },
      ...(search
        ? {
            OR: [
              { user: { name: { contains: search, mode: "insensitive" } } },
              { username: { contains: search, mode: "insensitive" } },
              { headline: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [total, profiles] = await Promise.all([
      (prisma as any).userProfile.count({ where }),
      (prisma as any).userProfile.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          username: true,
          headline: true,
          bio: true,
          openToWork: true,
          createdAt: true,
          user: { select: { name: true, avatar: true } },
          _count: {
            select: {
              skills: true,
              experiences: true,
              educations: true,
              projects: true,
              certifications: true,
              courses: true,
              languages: true,
            },
          },
        },
      }),
    ]);

    const students = profiles.map((p: any) => ({
      id: p.id,
      username: p.username,
      name: p.user?.name || "Unknown",
      avatar: p.user?.avatar || null,
      headline: p.headline || null,
      bio: p.bio ? (p.bio.length > 150 ? p.bio.slice(0, 150) + "…" : p.bio) : null,
      openToWork: p.openToWork,
      createdAt: p.createdAt,
      publicUrl: `/u/${p.username}`,
      counts: {
        skills: p._count.skills,
        experiences: p._count.experiences,
        educations: p._count.educations,
        projects: p._count.projects,
        certifications: p._count.certifications,
        courses: p._count.courses,
        languages: p._count.languages,
      },
    }));

    return NextResponse.json({ students, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Portal public profiles error:", error);
    return NextResponse.json({ error: "Failed to load public profiles" }, { status: 500 });
  }
}
