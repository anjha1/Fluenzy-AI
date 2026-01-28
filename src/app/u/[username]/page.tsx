"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/public-profile/${username}`);
        if (res.ok) {
          setData(await res.json());
        }
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!data) {
    return <div className="container mx-auto px-4 py-8">Profile not available.</div>;
  }

  const { profile, sections } = data;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Card className="bg-slate-900/60 border-slate-700/50">
        <CardContent className="p-6 flex items-center gap-4">
          {profile.user?.image ? (
            <img src={profile.user.image} alt={profile.user.name} className="w-16 h-16 rounded-full" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-slate-700" />
          )}
          <div>
            <h1 className="text-2xl font-bold text-white">{profile.user?.name}</h1>
            <p className="text-slate-400">{profile.headline}</p>
            {profile.openToWork && <Badge className="mt-2">Open to Work</Badge>}
          </div>
        </CardContent>
      </Card>

      {["skills", "experiences", "educations", "certifications", "projects", "courses", "languages"].map((key) => (
        <Card key={key} className="bg-slate-900/60 border-slate-700/50">
          <CardHeader>
            <CardTitle className="capitalize">{key.replace(/s$/, "")}</CardTitle>
          </CardHeader>
          <CardContent>
            {sections[key]?.length ? (
              <div className="space-y-2">
                {sections[key].map((item: any) => (
                  <div key={item.id} className="text-sm text-slate-300">
                    {item.name || item.title || item.role}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No data shared.</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
