import type { Metadata } from "next";
import InstallPage from "@/components/InstallPage";

export const metadata: Metadata = {
  title: "Install FluenzyAI",
  description: "Install FluenzyAI as a fast, convenient app on your device.",
};

export default function Page() {
  return <InstallPage />;
}
