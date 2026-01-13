"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LearningPath from "../../../Learn_English/components/LearningPath";

const TrainPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

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

  return (
    <div className="bg-slate-900/30 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl p-6 md:p-8 lg:p-12">
      <LearningPath />
    </div>
  );
};

export default TrainPage;