/**
 * GET /api/college/public-profiles
 * Returns paginated list of this college's students who have publicProfileEnabled=true.
 * Query params: page, limit, search (name/username/email), department, batchId
 *
 * Authorization: collegeAdminId always derived from JWT — never trusted from request params.
 */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCollegeAdminFromRequest } from "@/lib/collegeAuth";

export async function GET(req: NextRequest) {
  const admin = await getCollegeAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page       = Math.max(1, parseInt(searchParams.get("page")  ?? "1"));
  const limit      = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "20")));
  const search     = searchParams.get("search")?.trim().toLowerCase() ?? "";
  const department = searchParams.get("department")?.trim() ?? "";
  const batchId    = searchParams.get("batchId")?.trim() ?? "";

  // ── Step 1: All students for this college (with batch info) ──────────────
  const allStudents = await prisma.collegeStudent.findMany({
    where: { collegeAdminId: admin.id },
    select: {
      id: true,
      studentName: true,
      email: true,
      department: true,
      year: true,
      rollNumber: true,
      batchId: true,
      userId: true,
      status: true,
      batch: { select: { id: true, name: true, department: true } },
    },
  });

  if (allStudents.length === 0) {
    return NextResponse.json({ students: [], total: 0, page, limit, totalPages: 0 });
  }

  // ── Step 2: Fetch users + profiles by matching email ──────────────────────
  const emails = allStudents.map((s) => s.email);

  const usersWithProfiles = await (prisma as any).users.findMany({
    where: { email: { in: emails } },
    select: {
      id: true,
      email: true,
      avatar: true,
      profile: {
        select: {
          username: true,
          headline: true,
          bio: true,
          openToWork: true,
          publicProfileEnabled: true,
          publicSections: true,
          socialLinks: true,
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
      },
    },
  });

  // ── Step 3: Build a map of email → { avatar, profile } ────────────────────
  const userMap = new Map<string, { avatar: string | null; profile: any }>();
  for (const u of usersWithProfiles) {
    userMap.set(u.email.toLowerCase(), { avatar: u.avatar, profile: u.profile });
  }

  // ── Step 4: Filter + Search + Enrich ──────────────────────────────────────
  type EnrichedStudent = {
    studentId: string;
    studentName: string;
    email: string;
    department: string | null;
    year: number | null;
    rollNumber: string | null;
    status: string;
    batch: { id: string; name: string; department: string | null } | null;
    avatar: string | null;
    username: string;
    headline: string | null;
    bio: string | null;
    openToWork: boolean;
    analyticsEnabled: boolean;
    profileUrl: string;
    analyticsUrl: string;
    counts: {
      skills: number;
      experiences: number;
      educations: number;
      projects: number;
      certifications: number;
      courses: number;
      languages: number;
    };
  };

  const enriched: EnrichedStudent[] = [];

  for (const s of allStudents) {
    const mapped = userMap.get(s.email.toLowerCase());
    if (!mapped?.profile?.publicProfileEnabled) continue; // only public profiles

    const profile = mapped.profile;
    const publicSections = (profile.publicSections as any) || {};
    const analyticsEnabled = Boolean(publicSections.analyticsReport);

    // Apply department filter
    if (department && s.department?.toLowerCase() !== department.toLowerCase()) continue;
    // Apply batchId filter
    if (batchId && s.batchId !== batchId) continue;

    // Apply search filter (name, email, username, department)
    if (search) {
      const haystack = [
        s.studentName, s.email, profile.username ?? "",
        s.department ?? "", s.rollNumber ?? "",
      ].join(" ").toLowerCase();
      if (!haystack.includes(search)) continue;
    }

    enriched.push({
      studentId: s.id,
      studentName: s.studentName,
      email: s.email,
      department: s.department ?? null,
      year: s.year ?? null,
      rollNumber: s.rollNumber ?? null,
      status: s.status,
      batch: s.batch ?? null,
      avatar: mapped.avatar ?? null,
      username: profile.username,
      headline: profile.headline ?? null,
      bio: profile.bio ? (profile.bio.length > 150 ? profile.bio.slice(0, 150) + "…" : profile.bio) : null,
      openToWork: profile.openToWork ?? false,
      analyticsEnabled,
      profileUrl: `/u/${profile.username}`,
      analyticsUrl: analyticsEnabled ? `/analytics/report?public=1&username=${profile.username}` : "",
      counts: {
        skills:         profile._count?.skills         ?? 0,
        experiences:    profile._count?.experiences    ?? 0,
        educations:     profile._count?.educations     ?? 0,
        projects:       profile._count?.projects       ?? 0,
        certifications: profile._count?.certifications ?? 0,
        courses:        profile._count?.courses        ?? 0,
        languages:      profile._count?.languages      ?? 0,
      },
    });
  }

  // ── Step 5: Paginate ──────────────────────────────────────────────────────
  const total      = enriched.length;
  const totalPages = Math.ceil(total / limit);
  const students   = enriched.slice((page - 1) * limit, page * limit);

  return NextResponse.json({ students, total, page, limit, totalPages });
}
