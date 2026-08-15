"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CollegeProtectedLayout from "../components/CollegeProtectedLayout";
import {
  Users, Globe, BarChart2, Search, Download,
  ChevronLeft, ChevronRight, Loader2, ExternalLink,
  GraduationCap, Briefcase, Award, BookOpen, RefreshCw,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────
interface PublicStudent {
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
}

interface Summary { totalStudents: number; publicProfiles: number; publicAnalytics: number }

// ─── Small helpers ───────────────────────────────────────────────────────────
function Avatar({ name, avatar }: { name: string; avatar: string | null }) {
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className="w-9 h-9 rounded-xl object-cover flex-shrink-0"
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
      />
    );
  }
  return (
    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-600/30 border border-indigo-500/25 flex items-center justify-center flex-shrink-0">
      <span className="text-sm font-bold text-indigo-300">{name?.[0]?.toUpperCase() ?? "?"}</span>
    </div>
  );
}

function SummaryCard({ label, value, icon: Icon, color }: {
  label: string; value: number | string; icon: any; color: string;
}) {
  return (
    <div className="bg-[#111827]/80 border border-slate-700/50 rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{typeof value === "number" ? value.toLocaleString("en-IN") : value}</p>
        <p className="text-xs text-slate-400 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function CountBadge({ n, label, color }: { n: number; label: string; color: string }) {
  if (!n) return null;
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${color}`}>
      {n} {label}
    </span>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function PublicProfilesPage() {
  const router = useRouter();

  // Summary
  const [summary, setSummary]       = useState<Summary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  // Students list
  const [students, setStudents]     = useState<PublicStudent[]>([]);
  const [total, setTotal]           = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage]             = useState(1);
  const [listLoading, setListLoading] = useState(true);

  // Filters
  const [search, setSearch]         = useState("");
  const [department, setDepartment] = useState("");
  const [batchName, setBatchName]   = useState("");

  // Derived filter options from loaded students (for dropdowns)
  const [allDepts, setAllDepts]     = useState<string[]>([]);
  const [allBatches, setAllBatches] = useState<string[]>([]);

  const LIMIT = 20;

  // ── Auth token helper ──────────────────────────────────────────────────────
  const token = () =>
    typeof window !== "undefined" ? localStorage.getItem("college_token") : null;

  // ── Fetch summary ──────────────────────────────────────────────────────────
  const fetchSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const res = await fetch("/api/college/public-profiles/summary", {
        headers: { Authorization: `Bearer ${token()}` },
      });
      if (res.ok) setSummary(await res.json());
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  // ── Fetch students list ────────────────────────────────────────────────────
  const fetchStudents = useCallback(async (p = 1, q = "", dept = "", batch = "") => {
    setListLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(LIMIT) });
      if (q)    params.set("search", q);
      if (dept) params.set("department", dept);
      const res = await fetch(`/api/college/public-profiles?${params}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      if (res.ok) {
        const d = await res.json();
        setStudents(d.students);
        setTotal(d.total);
        setTotalPages(d.totalPages);
        setPage(p);

        // Extract unique departments and batch names for filter dropdowns
        if (p === 1 && !q && !dept && !batch) {
          const depts   = [...new Set(d.students.map((s: PublicStudent) => s.department).filter(Boolean))] as string[];
          const batches = [...new Set(d.students.map((s: PublicStudent) => s.batch?.name).filter(Boolean))] as string[];
          setAllDepts(depts);
          setAllBatches(batches);
        }
      }
    } finally {
      setListLoading(false);
    }
  }, []);

  // ── Initial load ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!token()) { router.replace("/college/login"); return; }
    fetchSummary();
    fetchStudents(1, "", "", "");
  }, [fetchSummary, fetchStudents, router]);

  // ── Search handler (debounced via onChange) ─────────────────────────────────
  const handleSearch = (val: string) => {
    setSearch(val);
    fetchStudents(1, val, department, batchName);
  };

  const handleDept = (val: string) => {
    setDepartment(val);
    fetchStudents(1, search, val, batchName);
  };

  // ── CSV download ──────────────────────────────────────────────────────────
  const downloadCSV = () => {
    const a = document.createElement("a");
    a.href = "/api/college/public-profiles/export";
    // Inject token as Authorization header isn't possible via <a> — use fetch+blob instead
    const t = token();
    if (!t) return;
    fetch("/api/college/public-profiles/export", {
      headers: { Authorization: `Bearer ${t}` },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `fluenzy-public-student-profiles-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      });
  };

  // ── Pagination range ───────────────────────────────────────────────────────
  const pageRange = () => {
    const total5 = Math.min(5, totalPages);
    const start  = Math.max(1, Math.min(page - 2, totalPages - total5 + 1));
    return Array.from({ length: total5 }, (_, i) => start + i);
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <CollegeProtectedLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">

        {/* ── Page header ─────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-400" />
              Public Student Profiles
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Students who have enabled &ldquo;Profile Visible to Public&rdquo;
            </p>
          </div>
          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/25 rounded-xl text-sm font-medium transition"
          >
            <Download className="w-4 h-4" />
            Download CSV
          </button>
        </div>

        {/* ── Summary cards ───────────────────────────────────────────────── */}
        {summaryLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-slate-800/40 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : summary ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SummaryCard
              label="Total Students"
              value={summary.totalStudents}
              icon={Users}
              color="bg-indigo-500/15 border border-indigo-500/20 text-indigo-400"
            />
            <SummaryCard
              label="Public Profiles"
              value={summary.publicProfiles}
              icon={Globe}
              color="bg-emerald-500/15 border border-emerald-500/20 text-emerald-400"
            />
            <SummaryCard
              label="Public Analytics"
              value={summary.publicAnalytics}
              icon={BarChart2}
              color="bg-purple-500/15 border border-purple-500/20 text-purple-400"
            />
          </div>
        ) : null}

        {/* ── Search + Filters ────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by name, username, email or department…"
              className="w-full pl-9 pr-4 py-2.5 bg-[#111827]/80 border border-slate-700/50 text-white placeholder-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          {/* Department filter */}
          <select
            value={department}
            onChange={(e) => handleDept(e.target.value)}
            className="px-3 py-2.5 bg-[#111827]/80 border border-slate-700/50 text-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 min-w-[160px]"
          >
            <option value="">All Departments</option>
            {allDepts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Refresh */}
          <button
            onClick={() => { fetchSummary(); fetchStudents(page, search, department, batchName); }}
            className="p-2.5 bg-[#111827]/80 border border-slate-700/50 text-slate-400 hover:text-white rounded-xl transition"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* ── Student Table ────────────────────────────────────────────────── */}
        <div className="bg-[#111827]/80 border border-slate-700/50 rounded-2xl overflow-hidden">

          {/* Table header */}
          <div className="px-5 py-3.5 border-b border-slate-700/40">
            <p className="text-sm text-slate-400">
              {listLoading ? "Loading…" : (
                total > 0
                  ? `Showing ${Math.min((page - 1) * LIMIT + 1, total)}–${Math.min(page * LIMIT, total)} of ${total} public profile${total !== 1 ? "s" : ""}`
                  : "No public profiles yet"
              )}
            </p>
          </div>

          {listLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-7 h-7 text-indigo-400 animate-spin" />
            </div>
          ) : students.length === 0 ? (
            /* ── Empty state ──────────────────────────────────────────────── */
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
                <Globe className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No Public Profiles Yet</h3>
              <p className="text-slate-500 text-sm max-w-md leading-relaxed">
                Students who enable &ldquo;Profile Visible to Public&rdquo; will appear here.
                Once students make their profiles public, their profiles will automatically
                appear in this section.
              </p>
            </div>
          ) : (
            /* ── Table ────────────────────────────────────────────────────── */
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/40">
                    {["Student", "Department / Batch", "Headline", "Profile Data", "Analytics", "Actions"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium text-slate-500 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr
                      key={s.studentId}
                      className="border-b border-slate-700/20 hover:bg-slate-800/30 transition-colors"
                    >
                      {/* Student */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={s.studentName} avatar={s.avatar} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="text-sm font-semibold text-white truncate">{s.studentName}</p>
                              {s.openToWork && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 rounded-full whitespace-nowrap">
                                  Open to Work
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 truncate">@{s.username}</p>
                          </div>
                        </div>
                      </td>

                      {/* Department / Batch */}
                      <td className="px-5 py-3.5">
                        <p className="text-xs text-slate-300">{s.department ?? "—"}</p>
                        {s.batch && (
                          <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                            <GraduationCap className="w-3 h-3" />
                            {s.batch.name}
                          </p>
                        )}
                        {s.rollNumber && (
                          <p className="text-[10px] text-slate-600 mt-0.5">{s.rollNumber}</p>
                        )}
                      </td>

                      {/* Headline */}
                      <td className="px-5 py-3.5 max-w-[200px]">
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {s.headline ?? <span className="text-slate-600">No headline</span>}
                        </p>
                      </td>

                      {/* Profile data counts */}
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          <CountBadge n={s.counts.skills}         label="skills" color="bg-blue-500/10 text-blue-400" />
                          <CountBadge n={s.counts.experiences}    label="exp"    color="bg-amber-500/10 text-amber-400" />
                          <CountBadge n={s.counts.projects}       label="proj"   color="bg-purple-500/10 text-purple-400" />
                          <CountBadge n={s.counts.certifications} label="certs"  color="bg-teal-500/10 text-teal-400" />
                          <CountBadge n={s.counts.educations}     label="edu"    color="bg-rose-500/10 text-rose-400" />
                        </div>
                        {(s.counts.skills + s.counts.experiences + s.counts.projects +
                          s.counts.certifications + s.counts.educations) === 0 && (
                          <span className="text-xs text-slate-600">No data</span>
                        )}
                      </td>

                      {/* Analytics status */}
                      <td className="px-5 py-3.5">
                        {s.analyticsEnabled ? (
                          <span className="flex items-center gap-1 text-xs text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Public
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                            Private
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <a
                            href={s.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 hover:bg-indigo-500/20 rounded-lg transition whitespace-nowrap"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Profile
                          </a>
                          {s.analyticsEnabled && s.analyticsUrl ? (
                            <a
                              href={s.analyticsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 bg-purple-500/10 text-purple-400 border border-purple-500/25 hover:bg-purple-500/20 rounded-lg transition whitespace-nowrap"
                            >
                              <BarChart2 className="w-3 h-3" />
                              Analytics
                            </a>
                          ) : (
                            <span className="text-[10px] text-slate-600 px-1">Analytics: Private</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Pagination ─────────────────────────────────────────────────── */}
          {!listLoading && totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-700/40">
              <p className="text-xs text-slate-500">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={page <= 1}
                  onClick={() => fetchStudents(page - 1, search, department, batchName)}
                  className="p-1.5 rounded-lg bg-slate-800/60 border border-slate-700/40 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {pageRange().map((p) => (
                  <button
                    key={p}
                    onClick={() => fetchStudents(p, search, department, batchName)}
                    className={`min-w-[32px] h-8 rounded-lg text-xs font-medium border transition ${
                      p === page
                        ? "bg-indigo-600/30 border-indigo-500/50 text-indigo-300"
                        : "bg-slate-800/60 border-slate-700/40 text-slate-400 hover:text-white hover:bg-slate-700/40"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  disabled={page >= totalPages}
                  onClick={() => fetchStudents(page + 1, search, department, batchName)}
                  className="p-1.5 rounded-lg bg-slate-800/60 border border-slate-700/40 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </CollegeProtectedLayout>
  );
}
