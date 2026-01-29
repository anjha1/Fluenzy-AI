"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  CalendarDays, Copy, Download, FileText, Pencil, Trash2, 
  MapPin, Briefcase, Link as LinkIcon, Github, Linkedin, Globe, Cpu, 
  Code2, User as UserIcon, Loader2, Upload, BadgeCheck, Zap, Plus, BookOpen, ExternalLink, Settings,
  CreditCard, History
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface PlanInfo {
  plan: string;
  planName: string;
  price: number;
  currency: string;
  monthlyLimit: number | null;
  isUnlimited: boolean;
  currentUsage: number;
  remainingUses: string | number;
  renewalDate: Date | null;
  subscription: any;
}

interface ProfileData {
  user: { name: string; email: string; image: string | null };
  profile: {
    id: string;
    username: string;
    headline?: string;
    bio?: string;
    socialLinks?: {
      github?: string;
      linkedin?: string;
      portfolio?: string;
      leetcode?: string;
    };
    openToWork: boolean;
    publicProfileEnabled: boolean;
    publicSections: Record<string, boolean>;
  };
  planInfo: PlanInfo;
  sections: {
    skills: any[];
    experiences: any[];
    educations: any[];
    certifications: any[];
    projects: any[];
    courses: any[];
    languages: any[];
  };
  activity: Record<string, number>;
  resumes: Array<{ id: string; fileName: string; fileUrl: string; uploadedAt: string }>;
  payments: any[];
}

type SectionType =
  | "skill"
  | "experience"
  | "education"
  | "certification"
  | "project"
  | "course"
  | "language";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionType | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [certificateUploading, setCertificateUploading] = useState(false);
  const [certificateError, setCertificateError] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  const activityMap = profileData?.activity ?? {};

  const heatmapDays = useMemo(() => {
    const days: { key: string; count: number }[] = [];
    const start = new Date();
    start.setDate(start.getDate() - 140);
    for (let i = 0; i <= 140; i += 1) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const key = date.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
      days.push({ key, count: activityMap[key] || 0 });
    }
    return days;
  }, [activityMap]);

  if (status === "loading" || loading) {
    return (
       <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
       </div>
    );
  }

  if (!session?.user) return null;
  if (!profileData) return null;

  const { user, profile, planInfo, sections, activity, payments, resumes } = profileData;

  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
  const normalizedBaseUrl = appBaseUrl.replace(/\/+$/, "");
  const publicProfileUrl = normalizedBaseUrl
    ? `${normalizedBaseUrl}/u/${profile.username}`
    : `/u/${profile.username}`;

  const uploadResume = async () => {
    if (!resumeFile) return;
    setResumeUploading(true);
    setResumeError(null);

    try {
      const body = new FormData();
      body.append("file", resumeFile);
      const res = await fetch("/api/profile/resume", { method: "POST", body });
      if (!res.ok) {
        const error = await res.json().catch(() => null);
        setResumeError(error?.error || "Failed to upload resume");
      } else {
        setResumeFile(null);
        const refreshed = await fetch("/api/profile");
        if (refreshed.ok) setProfileData(await refreshed.json());
      }
    } catch (error) {
      console.error("Resume upload error:", error);
      setResumeError("Failed to upload resume");
    } finally {
      setResumeUploading(false);
    }
  };

  const openDialog = (type: SectionType, item: any = null) => {
    const prefilled = item ? { ...item } : {};
    if (type === "certification" && item?.skills?.length) {
      prefilled.skillsText = item.skills.join(", ");
    }
    if (type !== "certification") {
      setCertificateFile(null);
      setCertificateUploading(false);
      setCertificateError(null);
    }
    setActiveSection(type);
    setEditingItem(item);
    setFormData(prefilled);
    setDialogOpen(true);
  };

  const uploadCertificateImage = async () => {
    if (!certificateFile) return;
    setCertificateUploading(true);
    setCertificateError(null);
    try {
      const body = new FormData();
      body.append("file", certificateFile);
      const res = await fetch("/api/profile/certifications/upload", { method: "POST", body });
      if (!res.ok) {
        const error = await res.json().catch(() => null);
        setCertificateError(error?.error || "Failed to upload certificate image");
      } else {
        const payload = await res.json();
        setFormData((prev) => ({ ...prev, imageUrl: payload.imageUrl }));
      }
    } catch (error) {
      console.error("Certificate image upload error:", error);
      setCertificateError("Failed to upload certificate image");
    } finally {
      setCertificateUploading(false);
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return;
    setAvatarUploading(true);
    setAvatarError(null);
    try {
      const body = new FormData();
      body.append("file", avatarFile);
      const res = await fetch("/api/profile/avatar", { method: "POST", body });
      if (!res.ok) {
        const error = await res.json().catch(() => null);
        setAvatarError(error?.error || "Failed to upload profile image");
      } else {
        const payload = await res.json();
        setProfileData((prev) => prev ? { ...prev, user: { ...prev.user, image: payload.imageUrl } } : prev);
      }
    } catch (error) {
      console.error("Avatar upload error:", error);
      setAvatarError("Failed to upload profile image");
    } finally {
      setAvatarUploading(false);
    }
  };

  const saveSection = async () => {
    if (!activeSection) return;
    const method = editingItem ? "PUT" : "POST";
    const payloadData = { ...formData };
    if (activeSection === "certification") {
      const raw = (formData.skillsText || "") as string;
      payloadData.skills = raw.split(",").map((s) => s.trim()).filter(Boolean);
    }
    if (activeSection === "skill" && !payloadData.level) {
      payloadData.level = "Beginner";
    }
    const payload = { type: activeSection, id: editingItem?.id, data: payloadData };
    const res = await fetch("/api/profile/sections", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const refreshed = await fetch("/api/profile");
      if (refreshed.ok) setProfileData(await refreshed.json());
      setDialogOpen(false);
    }
  };

  const deleteSection = async (type: SectionType, id: string) => {
    await fetch("/api/profile/sections", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id }),
    });
    const refreshed = await fetch("/api/profile");
    if (refreshed.ok) setProfileData(await refreshed.json());
  };

  const updateProfile = async (
    updates: Partial<ProfileData["profile"]> & { name?: string; image?: string | null }
  ) => {
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: updates.username ?? profile.username,
          headline: updates.headline ?? profile.headline,
          bio: updates.bio ?? profile.bio,
          socialLinks: updates.socialLinks ?? profile.socialLinks,
          openToWork: updates.openToWork ?? profile.openToWork,
          publicProfileEnabled: updates.publicProfileEnabled ?? profile.publicProfileEnabled,
          publicSections: updates.publicSections ?? profile.publicSections,
          name: updates.name ?? user.name,
          image: updates.image ?? user.image,
        }),
      });
      if (res.ok) {
        const refreshed = await fetch("/api/profile");
        if (refreshed.ok) setProfileData(await refreshed.json());
      }
    } catch (error) {
      console.error("Profile update error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 relative overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 space-y-8">
        
        {/* Glassmorphic Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex items-center gap-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full blur-xl opacity-50" />
                {user.image ? (
                  <img src={user.image} alt={user.name} className="relative w-32 h-32 rounded-full object-cover ring-4 ring-slate-950 shadow-2xl" />
                ) : (
                  <div className="relative w-32 h-32 rounded-full bg-slate-800 flex items-center justify-center ring-4 ring-slate-950 shadow-2xl">
                    <UserIcon className="w-12 h-12 text-slate-500" />
                  </div>
                )}
                <div className="absolute bottom-1 right-1 bg-slate-950 p-1.5 rounded-full">
                   <div className="w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-slate-950 animate-pulse" />
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{user.name}</h1>
                  <p className="text-lg text-slate-400 font-medium">{user.email}</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 px-3 py-1 text-xs font-black uppercase tracking-widest hover:bg-purple-500/20 transition-colors">
                    {planInfo.planName} Plan
                  </Badge>
                  {profile.openToWork && (
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1 text-xs font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-colors">
                      Open to Work
                    </Badge>
                  )}
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-white/5 text-xs font-bold text-slate-400">
                    <CalendarDays className="w-3 h-3" />
                    <span>Renews {planInfo.renewalDate ? new Date(planInfo.renewalDate).toLocaleDateString() : "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto">
               <Button asChild className="bg-white text-black hover:bg-slate-200 font-black uppercase tracking-widest text-xs h-12 rounded-xl shadow-lg transition-all active:scale-95">
                  <Link href="/billing">Manage Subscription</Link>
               </Button>
               <Button asChild variant="outline" className="border-white/10 text-slate-300 hover:text-white hover:bg-white/5 font-bold uppercase tracking-widest text-xs h-12 rounded-xl">
                  <Link href="/">Back to Workspace</Link>
               </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Public Profile Card */}
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.1 }}
               className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 space-y-6"
            >
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                        <Globe className="w-5 h-5" />
                     </div>
                     <h3 className="font-bold text-white">Public Profile</h3>
                  </div>
                  <Switch
                    checked={profile.publicProfileEnabled}
                    onCheckedChange={(checked) => updateProfile({ publicProfileEnabled: checked })}
                    className="data-[state=checked]:bg-blue-500"
                  />
               </div>
               
               <div className="space-y-3">
                 <div className="group relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <LinkIcon className="h-4 w-4 text-slate-500" />
                    </div>
                    <Input 
                       value={publicProfileUrl} 
                       readOnly 
                       className="bg-slate-950/50 border-white/10 pl-10 text-xs text-slate-400 h-10 rounded-xl focus-visible:ring-blue-500/50" 
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-1 top-1 h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg"
                      onClick={() => navigator.clipboard.writeText(publicProfileUrl)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                 </div>
                 
                 <div className="p-4 rounded-xl bg-slate-950/30 border border-white/5 space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Visible Sections</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                         { key: "skills", label: "Skills" },
                         { key: "experience", label: "Exp" },
                         { key: "education", label: "Edu" },
                         { key: "projects", label: "Proj" },
                      ].map((item) => (
                        <button
                           key={item.key}
                           onClick={() => updateProfile({ 
                              publicSections: { ...profile.publicSections, [item.key]: !profile.publicSections?.[item.key] } 
                           })}
                           className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                              profile.publicSections?.[item.key] 
                                 ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
                                 : 'bg-slate-800/50 text-slate-500 border-transparent hover:border-white/10'
                           }`}
                        >
                           {item.label}
                        </button>
                      ))}
                    </div>
                 </div>
               </div>
            </motion.div>

            {/* Contribution Graph */}
            <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.2 }}
               className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 space-y-4"
            >
               <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                     <Zap className="w-5 h-5" />
                  </div>
                  <div>
                     <h3 className="font-bold text-white">Activity</h3>
                     <p className="text-xs text-slate-500 font-medium">{planInfo.currentUsage} sessions this month</p>
                  </div>
               </div>
               
               <div className="grid grid-cols-[repeat(auto-fit,minmax(8px,1fr))] gap-1.5 p-2 bg-slate-950/30 rounded-xl border border-white/5">
                  {heatmapDays.map((day) => (
                    <div
                      key={day.key}
                      title={`${day.count} sessions on ${day.key}`}
                      className={`aspect-square rounded-[2px] transition-all hover:scale-125 ${
                        day.count === 0
                          ? "bg-slate-800/50"
                          : day.count < 2
                          ? "bg-emerald-900/80 shadow-[0_0_5px_rgba(16,185,129,0.2)]"
                          : day.count < 4
                          ? "bg-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                          : "bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.6)]"
                      }`}
                    />
                  ))}
               </div>
            </motion.div>

            {/* Resume Upload */}
            <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.25 }}
               className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 space-y-4"
            >
               <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                     <FileText className="w-5 h-5" />
                  </div>
                  <div>
                     <h3 className="font-bold text-white">Resume</h3>
                     <p className="text-xs text-slate-500">Managing {resumes.length} resume(s)</p>
                  </div>
               </div>
               
               <div className="space-y-3">
                 <div className="flex items-center gap-2">
                    <Input
                       type="file"
                       accept="application/pdf"
                       onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                       className="bg-slate-950/50 border-white/10 text-xs rounded-xl file:bg-slate-800 file:text-slate-300 file:border-0 file:rounded-lg file:mr-2 file:px-2 file:py-1 file:text-[10px]"
                    />
                    <Button
                       size="icon"
                       onClick={uploadResume}
                       disabled={!resumeFile || resumeUploading}
                       className="bg-purple-600 hover:bg-purple-700 rounded-xl shrink-0"
                    >
                       {resumeUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    </Button>
                 </div>
                 {resumes.map(resume => (
                    <div key={resume.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/30 border border-white/5">
                       <span className="text-xs text-slate-300 truncate max-w-[150px]">{resume.fileName}</span>
                       <a href={resume.fileUrl} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
                          <Download className="w-4 h-4" />
                       </a>
                    </div>
                 ))}
               </div>
            </motion.div>

          </div>

          {/* Right Content */}
          <div className="lg:col-span-8 space-y-8">
             
             {/* Edit Profile Form */}
             <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 space-y-8"
             >
                <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                   <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
                      <Pencil className="w-6 h-6" />
                   </div>
                   <div>
                      <h2 className="text-xl font-black text-white tracking-tight">Profile Details</h2>
                      <p className="text-sm text-slate-400 font-medium">Customize how others see you on Fluenzy</p>
                   </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                         <Input
                           value={user.name || ""}
                           onChange={(e) => updateProfile({ name: e.target.value })}
                           className="bg-slate-950/50 border-white/10 h-12 rounded-xl focus-visible:ring-purple-500/50"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Username</label>
                         <div className="relative">
                            <span className="absolute left-4 top-4 text-slate-500">@</span>
                            <Input
                              value={profile.username}
                              onChange={(e) => updateProfile({ username: e.target.value })}
                              className="bg-slate-950/50 border-white/10 h-12 rounded-xl pl-8 focus-visible:ring-purple-500/50"
                            />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Professional Headline</label>
                         <Input
                           value={profile.headline || ""}
                           onChange={(e) => updateProfile({ headline: e.target.value })}
                           placeholder="e.g. Senior Software Engineer"
                           className="bg-slate-950/50 border-white/10 h-12 rounded-xl focus-visible:ring-purple-500/50"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Profile Photo</label>
                         <div className="flex gap-2">
                           <Input
                             type="file"
                             accept="image/*"
                             onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                             className="bg-slate-950/50 border-white/10 rounded-xl file:bg-slate-800 file:text-white file:border-0 file:rounded-lg file:mr-4 file:px-4 file:py-2 text-xs"
                           />
                           <Button
                             onClick={uploadAvatar}
                             disabled={!avatarFile || avatarUploading}
                             className="bg-purple-600 hover:bg-purple-700 rounded-xl"
                           >
                              {avatarUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                           </Button>
                         </div>
                         {avatarError && <p className="text-xs text-red-400 ml-1">{avatarError}</p>}
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">About</label>
                         <Textarea
                           value={profile.bio || ""}
                           onChange={(e) => updateProfile({ bio: e.target.value })}
                           placeholder="Tell us about your professional journey..."
                           className="bg-slate-950/50 border-white/10 min-h-[140px] rounded-xl focus-visible:ring-purple-500/50 resize-none"
                         />
                      </div>
                      
                      <div className="space-y-4">
                         <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Social Presence</label>
                         <div className="space-y-3">
                            {[
                               { icon: Github, key: 'github', placeholder: 'GitHub URL' },
                               { icon: Linkedin, key: 'linkedin', placeholder: 'LinkedIn URL' },
                               { icon: Globe, key: 'portfolio', placeholder: 'Portfolio URL' },
                               { icon: Code2, key: 'leetcode', placeholder: 'LeetCode URL' },
                            ].map((social) => (
                               <div key={social.key} className="relative group">
                                  <div className="absolute left-3 top-3.5 text-slate-600 group-focus-within:text-purple-400 transition-colors">
                                     <social.icon className="w-4 h-4" />
                                  </div>
                                  <Input
                                    placeholder={social.placeholder}
                                    value={profile.socialLinks?.[social.key as keyof typeof profile.socialLinks] || ""}
                                    onChange={(e) =>
                                      updateProfile({
                                        socialLinks: { ...profile.socialLinks, [social.key]: e.target.value },
                                      })
                                    }
                                    className="bg-slate-950/50 border-white/10 h-11 rounded-xl pl-10 text-xs focus-visible:ring-purple-500/50"
                                  />
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
             </motion.div>

             {/* Profile Sections Grid */}
             <div className="grid md:grid-cols-2 gap-6">
                {[
                   { id: 'skill', title: 'Skills', icon: Cpu, items: sections.skills, render: (item: any) => (
                      <span className="flex items-center gap-2 bg-slate-800/50 border border-white/5 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium group">
                         {item.name}
                         <div className="w-px h-3 bg-white/10 mx-1" />
                         <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openDialog("skill", item)} className="hover:text-purple-400"><Pencil size={10} /></button>
                            <button onClick={() => deleteSection("skill", item.id)} className="hover:text-red-400"><Trash2 size={10} /></button>
                         </div>
                      </span>
                   )},
                   { id: 'experience', title: 'Experience', icon: Briefcase, items: sections.experiences, render: (item: any) => (
                      <div className="w-full bg-slate-950/30 border border-white/5 p-4 rounded-xl group hover:border-purple-500/30 transition-colors">
                         <div className="flex justify-between items-start">
                            <div>
                               <h4 className="font-bold text-white text-sm">{item.role}</h4>
                               <p className="text-xs text-purple-400">{item.company}</p>
                               <p className="text-[10px] text-slate-500 mt-1">{new Date(item.startDate).toLocaleDateString()} - {item.endDate ? new Date(item.endDate).toLocaleDateString() : 'Present'}</p>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button onClick={() => openDialog("experience", item)} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white"><Pencil size={12} /></button>
                               <button onClick={() => deleteSection("experience", item.id)} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-red-400"><Trash2 size={12} /></button>
                            </div>
                         </div>
                      </div>
                   )},
                   { id: 'education', title: 'Education', icon: BookOpen, items: sections.educations, render: (item: any) => (
                      <div className="w-full bg-slate-950/30 border border-white/5 p-4 rounded-xl group hover:border-blue-500/30 transition-colors">
                         <div className="flex justify-between items-start">
                            <div>
                               <h4 className="font-bold text-white text-sm">{item.degree}</h4>
                               <p className="text-xs text-blue-400">{item.institution}</p>
                               <p className="text-[10px] text-slate-500 mt-1">{item.startYear} - {item.endYear || 'Present'}</p>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button onClick={() => openDialog("education", item)} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white"><Pencil size={12} /></button>
                               <button onClick={() => deleteSection("education", item.id)} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-red-400"><Trash2 size={12} /></button>
                            </div>
                         </div>
                      </div>
                   )},
                   { id: 'project', title: 'Projects', icon: Code2, items: sections.projects, render: (item: any) => (
                      <div className="w-full bg-slate-950/30 border border-white/5 p-4 rounded-xl group hover:border-emerald-500/30 transition-colors">
                         <div className="flex justify-between items-start">
                            <div>
                               <h4 className="font-bold text-white text-sm">{item.title}</h4>
                               <p className="text-xs text-slate-400 line-clamp-2 mt-1">{item.description}</p>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button onClick={() => openDialog("project", item)} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white"><Pencil size={12} /></button>
                               <button onClick={() => deleteSection("project", item.id)} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-red-400"><Trash2 size={12} /></button>
                            </div>
                         </div>
                         {(item.projectUrl || item.repoUrl) && (
                            <div className="flex gap-2 mt-3">
                               {item.projectUrl && <a href={item.projectUrl} target="_blank" className="text-[10px] text-emerald-400 hover:underline">View Live</a>}
                               {item.repoUrl && <a href={item.repoUrl} target="_blank" className="text-[10px] text-slate-400 hover:underline">Source</a>}
                            </div>
                         )}
                      </div>
                   )},
                   { id: 'certification', title: 'Certifications', icon: BadgeCheck, items: sections.certifications, render: (item: any) => (
                      <div className="w-full bg-slate-950/30 border border-white/5 p-4 rounded-xl group hover:border-yellow-500/30 transition-colors">
                         <div className="flex justify-between items-start">
                            <div>
                               <h4 className="font-bold text-white text-sm">{item.name}</h4>
                               <p className="text-xs text-yellow-500">{item.issuer}</p>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button onClick={() => openDialog("certification", item)} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white"><Pencil size={12} /></button>
                               <button onClick={() => deleteSection("certification", item.id)} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-red-400"><Trash2 size={12} /></button>
                            </div>
                         </div>
                      </div>
                   )},
                ].map((section) => (
                   <motion.div
                      key={section.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 flex flex-col h-full"
                   >
                      <div className="flex items-center justify-between mb-6">
                         <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-slate-800 text-slate-300">
                               <section.icon className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-white">{section.title}</h3>
                         </div>
                         <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-white/10" onClick={() => openDialog(section.id as SectionType)}>
                            <Plus className="w-4 h-4" />
                         </Button>
                      </div>
                      <div className="flex-1 flex flex-wrap gap-2 content-start">
                         {section.items.length > 0 ? (
                            section.items.map(item => <div key={item.id} className="contents">{section.render(item)}</div>)
                         ) : (
                            <div className="w-full h-24 flex flex-col items-center justify-center text-slate-500 border border-dashed border-white/5 rounded-xl">
                               <p className="text-xs">No entries yet</p>
                               <Button size="sm" variant="link" className="text-purple-400 text-xs h-auto p-0 mt-1" onClick={() => openDialog(section.id as SectionType)}>Add {section.title}</Button>
                            </div>
                         )}
                      </div>
                   </motion.div>
                ))}
            </div>

            {/* Billing History (Collapsible or Card) */}
            <motion.div
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 opacity-75 hover:opacity-100 transition-opacity"
            >
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
                     <History className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-white text-sm">Billing History</h3>
               </div>
               <div className="space-y-2">
                  {payments.slice(0, 3).map(payment => (
                     <div key={payment.id} className="flex items-center justify-between text-xs p-3 rounded-lg bg-slate-950/50">
                        <div>
                           <p className="text-slate-300">{new Date(payment.date).toLocaleDateString()}</p>
                           <p className="text-slate-500">{payment.plan} • ₹{payment.amount}</p>
                        </div>
                        {payment.receiptUrl && (
                           <a href={payment.receiptUrl} className="text-purple-400 hover:underline">Invoice</a>
                        )}
                     </div>
                  ))}
                  {payments.length === 0 && <p className="text-xs text-slate-500">No payment history available.</p>}
               </div>
            </motion.div>

          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl bg-slate-900 border-white/10 text-white rounded-[2rem] p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">{editingItem ? "Edit" : "Add"} {activeSection && activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</DialogTitle>
            <DialogDescription className="text-slate-400">Fill in the details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {activeSection === "skill" && (
               <Input
                  placeholder="Skill Name (e.g. React, Python)"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-slate-950/50 border-white/10 h-12 rounded-xl"
               />
            )}
            
            {activeSection === "experience" && (
                <div className="space-y-4">
                  <Input placeholder="Role / Job Title" value={formData.role || ""} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="bg-slate-950/50 border-white/10 h-12 rounded-xl" />
                  <Input placeholder="Company Name" value={formData.company || ""} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="bg-slate-950/50 border-white/10 h-12 rounded-xl" />
                  <div className="grid grid-cols-2 gap-4">
                     <Input type="date" value={formData.startDate ? formData.startDate.slice(0, 10) : ""} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="bg-slate-950/50 border-white/10 h-12 rounded-xl" />
                     <Input type="date" value={formData.endDate ? formData.endDate.slice(0, 10) : ""} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="bg-slate-950/50 border-white/10 h-12 rounded-xl" />
                  </div>
                  <Textarea placeholder="Description..." value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="bg-slate-950/50 border-white/10 min-h-[100px] rounded-xl" />
                </div>
            )}
            
            {activeSection === "education" && (
                <div className="space-y-4">
                  <Input placeholder="Degree" value={formData.degree || ""} onChange={(e) => setFormData({ ...formData, degree: e.target.value })} className="bg-slate-950/50 border-white/10 h-12 rounded-xl" />
                  <Input placeholder="Institution" value={formData.institution || ""} onChange={(e) => setFormData({ ...formData, institution: e.target.value })} className="bg-slate-950/50 border-white/10 h-12 rounded-xl" />
                  <div className="grid grid-cols-2 gap-4">
                     <Input placeholder="Start Year" value={formData.startYear || ""} onChange={(e) => setFormData({ ...formData, startYear: e.target.value })} className="bg-slate-950/50 border-white/10 h-12 rounded-xl" />
                     <Input placeholder="End Year" value={formData.endYear || ""} onChange={(e) => setFormData({ ...formData, endYear: e.target.value })} className="bg-slate-950/50 border-white/10 h-12 rounded-xl" />
                  </div>
                </div>
            )}
            
            {activeSection === "project" && (
               <div className="space-y-4">
                  <Input placeholder="Project Title" value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="bg-slate-950/50 border-white/10 h-12 rounded-xl" />
                  <Input placeholder="Tech Stack (e.g. Next.js, AI)" value={formData.techStack || ""} onChange={(e) => setFormData({ ...formData, techStack: e.target.value })} className="bg-slate-950/50 border-white/10 h-12 rounded-xl" />
                  <div className="grid grid-cols-2 gap-4">
                     <Input placeholder="Live URL" value={formData.projectUrl || ""} onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })} className="bg-slate-950/50 border-white/10 h-12 rounded-xl" />
                     <Input placeholder="Repo URL" value={formData.repoUrl || ""} onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })} className="bg-slate-950/50 border-white/10 h-12 rounded-xl" />
                  </div>
                  <Textarea placeholder="Description..." value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="bg-slate-950/50 border-white/10 min-h-[100px] rounded-xl" />
               </div>
            )}

            {activeSection === "certification" && (
               <div className="space-y-4">
                   <Input placeholder="Certification Name" value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-slate-950/50 border-white/10 h-12 rounded-xl" />
                   <Input placeholder="Issuer" value={formData.issuer || ""} onChange={(e) => setFormData({ ...formData, issuer: e.target.value })} className="bg-slate-950/50 border-white/10 h-12 rounded-xl" />
                   <div className="space-y-2">
                     <label className="text-xs text-slate-400">Certificate Image</label>
                     <div className="flex gap-2">
                        <Input type="file" accept="image/*" onChange={(e) => setCertificateFile(e.target.files?.[0] || null)} className="bg-slate-950/50 border-white/10 text-xs rounded-xl" />
                        <Button onClick={uploadCertificateImage} disabled={!certificateFile || certificateUploading} size="sm" className="bg-slate-800">{certificateUploading ? <Loader2 className="animate-spin" /> : "Upload"}</Button>
                     </div>
                   </div>
               </div>
            )}

          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)} className="rounded-xl hover:bg-white/10">Cancel</Button>
            <Button onClick={saveSection} className="bg-purple-600 hover:bg-purple-700 rounded-xl">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}