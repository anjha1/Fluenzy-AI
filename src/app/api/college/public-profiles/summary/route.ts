/**
 * GET /api/college/public-profiles/summary
 * Returns summary counts for the college's Public Profiles dashboard section.
 * {
 *   totalStudents: number,   // all students in this college
 *   publicProfiles: number,  // students with publicProfileEnabled=true
 *   publicAnalytics: number, // students with publicProfileEnabled=true AND analyticsReport=true
 * }
 *
 * Authorization: collegeAdminId derived from JWT — never trusted from request params.
 */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCollegeAdminFromRequest } from "@/lib/collegeAuth";

export async function GET(req: NextRequest) {
  const admin = await getCollegeAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  // ── Total students ────────────────────────────────────────────────────────
  const totalStudents = await prisma.collegeStudent.count({
    where: { collegeAdminId: admin.id },
  });

  if (totalStudents === 0) {
    return NextResponse.json({ totalStudents: 0, publicProfiles: 0, publicAnalytics: 0 });
  }

  // ── Student emails ────────────────────────────────────────────────────────
  const studentEmails = await prisma.collegeStudent.findMany({
    where: { collegeAdminId: admin.id },
    select: { email: true },
  });
  const emails = studentEmails.map((s) => s.email);

  // ── Fetch profiles for these students ────────────────────────────────────
  const usersWithProfiles = await (prisma as any).users.findMany({
    where: { email: { in: emails } },
    select: {
      profile: {
        select: { publicProfileEnabled: true, publicSections: true },
      },
    },
  });

  let publicProfiles  = 0;
  let publicAnalytics = 0;

  for (const u of usersWithProfiles) {
    if (!u.profile?.publicProfileEnabled) continue;
    publicProfiles++;
    const sections = (u.profile.publicSections as any) || {};
    if (sections.analyticsReport) publicAnalytics++;
  }

  return NextResponse.json({ totalStudents, publicProfiles, publicAnalytics });
}
