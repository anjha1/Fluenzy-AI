"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import VoiceAgent from "../../../../../Learn_English/components/VoiceAgent";
import { UserProfile } from "../../../../../Learn_English/types";
import { INITIAL_USER } from "../../../../../Learn_English/constants";

const SessionPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const type = params.type as string;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session?.user) {
    return null;
  }

  // Convert NextAuth session to UserProfile
  const user: UserProfile = {
    ...INITIAL_USER,
    id: session.user.email || "u1",
    name: session.user.name || "User",
    email: session.user.email || "user@example.com",
    picture: session.user.image || undefined,
  };

  // Get lesson info from query params
  const lessonId = searchParams.get('lessonId');
  const lessonTitle = searchParams.get('lessonTitle');

  const sessionMeta = lessonId && lessonTitle ? {
    lessonId,
    lessonTitle: decodeURIComponent(lessonTitle)
  } : {};

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <VoiceAgent user={user} onSessionEnd={() => {}} />
    </div>
  );
};

export default SessionPage;