/**
 * GET /api/college/public-profiles/export
 * Streams a CSV of the college's students who have publicProfileEnabled=true.
 *
 * CSV columns:
 *   Student Name, Username, Email, Department, Batch, Year, Roll Number,
 *   Headline, About, Skills, Experience, Education, Certifications,
 *   Projects, Courses, Languages, Portfolio, GitHub, LinkedIn, LeetCode,
 *   Open To Work, Public Profile URL, Profile Visibility,
 *   Analytics Visibility, Analytics URL
 *
 * Analytics URL is included ONLY when analyticsReport=true, otherwise "Private".
 * Filename: fluenzy-public-student-profiles-YYYY-MM-DD.csv
 *
 * Authorization: collegeAdminId derived from JWT — never trusted from request params.
 */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCollegeAdminFromRequest } from "@/lib/collegeAuth";

/** Escape a value for RFC 4180 CSV: wrap in quotes if needed, double-up inner quotes. */
function csvCell(val: unknown): string {
  const s = val == null ? "" : String(val).replace(/\r?\n/g, " ");
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function csvRow(cols: unknown[]): string {
  return cols.map(csvCell).join(",");
}

export async function GET(req: NextRequest) {
  const admin = await getCollegeAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  // ── Fetch all students for this college ───────────────────────────────────
  const allStudents = await prisma.collegeStudent.findMany({
    where: { collegeAdminId: admin.id },
    select: {
      id: true,
      studentName: true,
      email: true,
      department: true,
      year: true,
      rollNumber: true,
      batch: { select: { name: true } },
    },
  });

  if (allStudents.length === 0) {
    const empty = "\uFEFF" + "Student Name,Username,Email,Department,Batch,Public Profile URL\r\n";
    return new NextResponse(empty, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="fluenzy-public-student-profiles-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  const emails = allStudents.map((s) => s.email);

  // ── Fetch users + full profiles (including related collections) ────────────
  const usersWithProfiles = await (prisma as any).users.findMany({
    where: { email: { in: emails } },
    select: {
      email: true,
      profile: {
        select: {
          username: true,
          headline: true,
          bio: true,
          openToWork: true,
          publicProfileEnabled: true,
          publicSections: true,
          socialLinks: true,
          skills:         { select: { name: true } },
          experiences:    { select: { role: true, company: true } },
          educations:     { select: { degree: true, institution: true } },
          certifications: { select: { name: true } },
          projects:       { select: { title: true } },
          courses:        { select: { name: true } },
          languages:      { select: { name: true } },
        },
      },
    },
  });

  // Build email → user map
  const userMap = new Map<string, any>();
  for (const u of usersWithProfiles) {
    userMap.set(u.email.toLowerCase(), u.profile);
  }

  // ── Build CSV rows ────────────────────────────────────────────────────────
  const BASE_URL = "https://fluenzyai.app";

  const HEADERS = [
    "Student Name", "Username", "Email", "Department", "Batch", "Year", "Roll Number",
    "Headline", "About",
    "Skills", "Experience", "Education", "Certifications",
    "Projects", "Courses", "Languages",
    "Portfolio", "GitHub", "LinkedIn", "LeetCode",
    "Open To Work",
    "Public Profile URL", "Profile Visibility",
    "Analytics Visibility", "Analytics URL",
  ];

  const rows: string[] = [csvRow(HEADERS)];

  for (const s of allStudents) {
    const profile = userMap.get(s.email.toLowerCase());
    if (!profile?.publicProfileEnabled) continue; // only public students

    const sections      = (profile.publicSections as any) || {};
    const analyticsOn   = Boolean(sections.analyticsReport);
    const socialLinks   = (profile.socialLinks as any) || {};

    const skills      = (profile.skills         as any[]).map((x: any) => x.name).join("; ");
    const experience  = (profile.experiences    as any[]).map((x: any) => `${x.role} @ ${x.company}`).join("; ");
    const education   = (profile.educations     as any[]).map((x: any) => `${x.degree}, ${x.institution}`).join("; ");
    const certs       = (profile.certifications as any[]).map((x: any) => x.name).join("; ");
    const projects    = (profile.projects       as any[]).map((x: any) => x.title).join("; ");
    const courses     = (profile.courses        as any[]).map((x: any) => x.name).join("; ");
    const languages   = (profile.languages      as any[]).map((x: any) => x.name).join("; ");

    const profileUrl    = `${BASE_URL}/u/${profile.username}`;
    const analyticsUrl  = analyticsOn
      ? `${BASE_URL}/analytics/report?public=1&username=${profile.username}`
      : "Private";

    rows.push(csvRow([
      s.studentName,
      profile.username,
      s.email,
      s.department ?? "",
      s.batch?.name ?? "",
      s.year ?? "",
      s.rollNumber ?? "",
      profile.headline ?? "",
      profile.bio ?? "",
      skills,
      experience,
      education,
      certs,
      projects,
      courses,
      languages,
      socialLinks.portfolio ?? "",
      socialLinks.github    ?? "",
      socialLinks.linkedin  ?? "",
      socialLinks.leetcode  ?? "",
      profile.openToWork ? "Yes" : "No",
      profileUrl,
      "Public",
      analyticsOn ? "Public" : "Private",
      analyticsUrl,
    ]));
  }

  // UTF-8 BOM for Excel compatibility
  const csv = "\uFEFF" + rows.join("\r\n");
  const today = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="fluenzy-public-student-profiles-${today}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
