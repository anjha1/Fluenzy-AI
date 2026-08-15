"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Lock, ExternalLink, ArrowLeft, Globe, EyeOff } from "lucide-react";

// Reuse the same profile data types and client component as /u/[username]
import PublicProfileClient from "@/app/u/[username]/PublicProfileClient";

type AdminProfileResponse = {
  publicProfileEnabled: boolean;
  profile: any;
  sections: any;
  activity: any;
  resumes: any[];
};

export default function AdminProfileViewPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;

  const [profileData, setProfileData] = useState<Omit<AdminProfileResponse, "publicProfileEnabled"> | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user.role as any) !== "SUPER_ADMIN") {
      router.push("/");
      return;
    }
    if (!username) return;

    fetch(`/api/admin/user-profile/${username}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          setError(d.error);
        } else {
          const { publicProfileEnabled, ...rest } = d;
          setIsPublic(publicProfileEnabled);
          setProfileData(rest);
        }
      })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, [session, status, username, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Loading profile…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-red-400 font-medium">{error}</p>
          <button
            onClick={() => router.back()}
            className="text-sm text-slate-400 hover:text-white transition"
          >
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Admin banner — sticky top bar */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Left side */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <span className="text-slate-700 select-none">|</span>
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-sm font-semibold text-amber-400">Admin View</span>
            </div>
            <span className="text-xs text-slate-500 hidden sm:inline">
              — Full profile access regardless of public visibility
            </span>
          </div>

          {/* Right side — visibility badge + public link */}
          <div className="flex items-center gap-2.5">
            {isPublic ? (
              <>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <Globe className="w-3 h-3" />
                  Public Profile
                </span>
                <a
                  href={`/u/${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition"
                >
                  <ExternalLink className="w-3 h-3" />
                  View as Public
                </a>
              </>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/30">
                <EyeOff className="w-3 h-3" />
                Private Profile
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Reuse existing PublicProfileClient — no duplicate profile design */}
      <PublicProfileClient initialData={profileData} username={username} />
    </div>
  );
}
