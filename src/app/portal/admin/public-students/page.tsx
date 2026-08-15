"use client";

import { useEffect, useState, useCallback } from "react";
import PortalLayout from "@/components/PortalLayout";
import { usePortalAuth } from "@/contexts/PortalAuthContext";
import { useRouter } from "next/navigation";

const ADMIN_NAV = [
  { label: "Dashboard", href: "/portal/admin" },
  { label: "Competitions", href: "/portal/admin/competitions" },
  { label: "User Management", href: "/portal/admin/users" },
  { label: "Public Students", href: "/portal/admin/public-students" },
  { label: "Subscriptions", href: "/portal/admin/subscriptions" },
  { label: "Payment Logs", href: "/portal/admin/payments" },
  { label: "Support Tickets", href: "/portal/admin/tickets" },
  { label: "Broadcast Email", href: "/portal/admin/broadcast-email" },
  { label: "Feature Toggles", href: "/portal/admin/feature-toggles" },
  { label: "Email History", href: "/portal/admin/email-logs" },
  { label: "Audit Logs", href: "/portal/admin/audit-logs" },
  { label: "Analytics", href: "/portal/admin/analytics" },
];

interface Student {
  id: string;
  username: string;
  name: string;
  avatar: string | null;
  headline: string | null;
  bio: string | null;
  openToWork: boolean;
  createdAt: string;
  publicUrl: string;
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

export default function PublicStudentsPage() {
  const { user, loading } = usePortalAuth();
  const router = useRouter();

  const [students, setStudents] = useState<Student[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loadingData, setLoadingData] = useState(true);

  const fetchStudents = useCallback(async (p = 1, q = "") => {
    setLoadingData(true);
    const params = new URLSearchParams({ page: String(p), limit: "20" });
    if (q) params.set("search", q);
    const res = await fetch(`/api/portal/admin/public-profiles?${params}`, { credentials: "include" });
    if (res.ok) {
      const d = await res.json();
      setStudents(d.students);
      setTotal(d.total);
      setTotalPages(d.totalPages);
      setPage(p);
    }
    setLoadingData(false);
  }, []);

  useEffect(() => {
    if (!loading && !user) { router.push("/portal/login"); return; }
    if (user) fetchStudents(1, "");
  }, [user, loading, router, fetchStudents]);

  const downloadCSV = () => {
    const a = document.createElement("a");
    a.href = "/api/portal/admin/public-profiles/export";
    a.download = "";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <PortalLayout navItems={ADMIN_NAV} title="Public Students" roleLabel="Admin Portal" roleColor="text-amber-400">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-44 bg-white/5 rounded-2xl animate-pulse" />)}
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout navItems={ADMIN_NAV} title="Public Students" roleLabel="Admin Portal" roleColor="text-amber-400">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-white">Public Students</h2>
            <p className="text-slate-400 text-sm">
              {total > 0
                ? `${total} student${total !== 1 ? "s" : ""} with public profile enabled`
                : "Students who enabled Profile Visible to Public"}
            </p>
          </div>
          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30 rounded-xl text-sm font-medium transition"
          >
            ⬇ Download CSV
          </button>
        </div>

        {/* Search */}
        <div className="flex gap-3">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              fetchStudents(1, e.target.value);
            }}
            placeholder="Search by name, username, or headline…"
            className="flex-1 bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
          <button
            onClick={() => fetchStudents(page, search)}
            className="px-4 py-2.5 bg-amber-600/20 border border-amber-500/30 text-amber-400 rounded-xl text-sm hover:bg-amber-600/30 transition"
          >
            Refresh
          </button>
        </div>

        {/* Student Cards */}
        {loadingData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="h-44 bg-white/5 rounded-2xl animate-pulse" />)}
          </div>
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">🌐</div>
            <h3 className="text-lg font-semibold text-white mb-1">No Public Profiles Yet</h3>
            <p className="text-slate-500 text-sm max-w-xs">
              Students who enable &ldquo;Profile Visible to Public&rdquo; will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {students.map((student) => (
              <div
                key={student.id}
                className="bg-white/3 border border-white/8 rounded-2xl p-4 flex flex-col gap-3 hover:border-amber-500/30 transition"
              >
                {/* Avatar + Name */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center text-base font-bold flex-shrink-0 overflow-hidden">
                    {student.avatar ? (
                      <img src={student.avatar} alt={student.name} className="w-10 h-10 object-cover" />
                    ) : (
                      (student.name?.[0] || "?").toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{student.name}</p>
                    <p className="text-xs text-slate-500 truncate">@{student.username}</p>
                  </div>
                  {student.openToWork && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 rounded-full flex-shrink-0">
                      Open
                    </span>
                  )}
                </div>

                {/* Headline */}
                {student.headline && (
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{student.headline}</p>
                )}

                {/* Counts */}
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  {student.counts.skills > 0 && <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full">{student.counts.skills} skills</span>}
                  {student.counts.experiences > 0 && <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded-full">{student.counts.experiences} exp</span>}
                  {student.counts.projects > 0 && <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-full">{student.counts.projects} projects</span>}
                  {student.counts.certifications > 0 && <span className="px-2 py-0.5 bg-teal-500/10 text-teal-400 rounded-full">{student.counts.certifications} certs</span>}
                  {student.counts.educations > 0 && <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 rounded-full">{student.counts.educations} edu</span>}
                </div>

                {/* Action */}
                <a
                  href={student.publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto text-center text-xs py-1.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition"
                >
                  View Public Profile ↗
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-slate-500">
              Showing {Math.min((page - 1) * 20 + 1, total)}–{Math.min(page * 20, total)} of {total} students
            </p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => fetchStudents(page - 1, search)}
                className="px-3 py-1.5 bg-white/5 border border-white/10 text-sm text-white rounded-lg disabled:opacity-40 hover:bg-white/10 transition"
              >
                ← Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => fetchStudents(page + 1, search)}
                className="px-3 py-1.5 bg-white/5 border border-white/10 text-sm text-white rounded-lg disabled:opacity-40 hover:bg-white/10 transition"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
