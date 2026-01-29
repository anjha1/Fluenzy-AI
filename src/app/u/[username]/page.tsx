"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  CalendarDays, 
  Code, 
  Download, 
  ExternalLink, 
  FileText, 
  Github, 
  Globe, 
  Linkedin, 
  MapPin, 
  Mail,
  Award,
  BookOpen,
  Layers,
  Sparkles,
  Cpu
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// --- Types ---
type ResumeItem = {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  fileSize?: number | null;
};

type PublicProfileData = {
  profile: {
    username: string;
    headline?: string;
    bio?: string;
    openToWork: boolean;
    user: { name: string; email: string; image?: string | null };
    socialLinks?: { github?: string; linkedin?: string; portfolio?: string; leetcode?: string } | null;
    location?: string;
  };
  sections: {
    skills: Array<{ id: string; name: string; level: string }>;
    experiences: Array<{ id: string; role: string; company: string; startDate: string; endDate?: string | null; description?: string | null }>;
    educations: Array<{ id: string; degree: string; institution: string; startYear: number; endYear?: number | null; grade?: string | null }>;
    certifications: Array<{
      id: string;
      name: string;
      issuer: string;
      issueDate: string;
      imageUrl?: string | null;
      credentialUrl?: string | null;
    }>;
    projects: Array<{ id: string; title: string; description?: string | null; techStack?: string | null; projectUrl?: string | null; repoUrl?: string | null }>;
    courses: Array<{ id: string; name: string; platform: string; status: string }>;
    languages: Array<{ id: string; name: string; proficiency: string }>;
  };
  activity: Record<string, number>;
  resumes: ResumeItem[];
};

// --- Helpers ---
const formatDate = (value?: string | Date | null) => {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const formatFileSize = (bytes?: number | null) => {
  if (!bytes) return "";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, index);
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[index]}`;
};

const splitBullets = (text?: string | null) => {
  if (!text) return [];
  const raw = text.split(/\n|•|\u2022|\r/).map((item) => item.replace(/^[-*]\s?/, "").trim()).filter(Boolean);
  if (raw.length) return raw.slice(0, 4);
  return text.split(/\.|\;/).map((item) => item.trim()).filter(Boolean).slice(0, 4);
};

// --- Components ---

const GlassCard = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={`bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl ${className}`}
  >
    {children}
  </motion.div>
);

const SectionHeader = ({ icon: Icon, title }: { icon: any; title: string }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="p-2 rounded-xl bg-slate-800/50 text-blue-400 ring-1 ring-white/5">
      <Icon size={20} />
    </div>
    <h3 className="text-xl font-bold text-slate-100">{title}</h3>
  </div>
);

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [data, setData] = useState<PublicProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<{ title: string; url: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/public-profile/${username}`);
        if (res.ok) setData(await res.json());
      } finally {
        setLoading(false);
      }
    };
    if (username) fetchProfile();
  }, [username]);

  const activityMap = data?.activity || {};
  const heatmapDays = useMemo(() => {
    const days: { key: string; count: number }[] = [];
    const start = new Date();
    start.setDate(start.getDate() - 140);
    for (let i = 0; i <= 140; i += 1) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const key = date.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
      days.push({ key, count: activityMap?.[key] || 0 });
    }
    return days;
  }, [activityMap]);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-slate-400 font-medium tracking-widest text-sm uppercase">Loading Profile...</p>
      </div>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto text-slate-600">
          <Sparkles size={32} />
        </div>
        <h1 className="text-2xl font-bold text-white">Profile Not Found</h1>
        <p className="text-slate-400">The user you are looking for does not exist or is private.</p>
      </div>
    </div>
  );

  const { profile, sections } = data;
  const primaryResume = data.resumes?.[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 relative overflow-x-hidden selection:bg-blue-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
         <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
      </div>

      <div className="relative z-10 container max-w-7xl mx-auto px-4 py-12 lg:py-20 space-y-8">
        
        {/* --- Hero Section --- */}
        <div className="grid lg:grid-cols-12 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-12"
          >
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
              <div className="absolute top-0 right-0 p-12 opacity-50 pointer-events-none">
                 <div className="w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px]" />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start md:items-center">
                <div className="relative group">
                   <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-500 rounded-[2rem] opacity-30 blur-lg group-hover:opacity-50 transition duration-500" />
                   <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-[2rem] overflow-hidden border-2 border-white/10 bg-slate-800 shadow-2xl">
                     {profile.user.image ? (
                       <img src={profile.user.image} alt={profile.user.name} className="w-full h-full object-cover" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-slate-600 bg-slate-900">
                         {profile.user.name.charAt(0)}
                       </div>
                     )}
                   </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-4">
                      <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{profile.user.name}</h1>
                      {profile.openToWork && (
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                          Open to Work
                        </span>
                      )}
                    </div>
                    <p className="text-xl md:text-2xl text-slate-300 font-light">{profile.headline || "Tech Enthusiast & Problem Solver"}</p>
                    {profile.location && (
                       <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                          <MapPin size={16} /> {profile.location}
                       </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    {profile.socialLinks?.github && (
                       <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/5 transition-colors">
                          <Github size={20} />
                       </a>
                    )}
                    {profile.socialLinks?.linkedin && (
                       <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-3 rounded-xl bg-[#0077b5]/10 hover:bg-[#0077b5]/20 text-[#0077b5] border border-[#0077b5]/20 transition-colors">
                          <Linkedin size={20} />
                       </a>
                    )}
                    {profile.socialLinks?.portfolio && (
                       <a href={profile.socialLinks.portfolio} target="_blank" rel="noreferrer" className="p-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 transition-colors">
                          <Globe size={20} />
                       </a>
                    )}
                    <a href={`mailto:${profile.user.email}`} className="p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-colors">
                       <Mail size={20} />
                    </a>
                  </div>
                </div>

                <div className="w-full md:w-auto flex flex-col gap-3">
                   {primaryResume && (
                      <Button onClick={() => setPreview({ title: "Resume Preview", url: primaryResume.fileUrl })} className="w-full h-12 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-semibold backdrop-blur-md">
                         <FileText className="mr-2 h-4 w-4" /> Preview Resume
                      </Button>
                   )}
                   {primaryResume && (
                      <a href={primaryResume.fileUrl} download className="w-full">
                         <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-900/20 rounded-xl font-bold tracking-wide">
                            <Download className="mr-2 h-4 w-4" /> Download CV
                         </Button>
                      </a>
                   )}
                </div>
              </div>

              {profile.bio && (
                 <div className="mt-8 pt-8 border-t border-white/5">
                    <p className="text-slate-400 leading-relaxed text-lg max-w-4xl">{profile.bio}</p>
                 </div>
              )}
            </div>
          </motion.div>
        </div>


        {/* --- Content Grid --- */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column (Sticky Sidebar) */}
          <div className="lg:col-span-1 space-y-8">
             
             {/* Skills */}
             {sections.skills.length > 0 && (
                <GlassCard delay={0.1}>
                   <SectionHeader icon={Cpu} title="Expertise" />
                   <div className="flex flex-wrap gap-2">
                      {sections.skills.map((skill) => (
                         <span key={skill.id} className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/50 text-slate-300 text-sm font-medium hover:border-blue-500/30 hover:text-blue-200 transition-colors cursor-default">
                            {skill.name}
                         </span>
                      ))}
                   </div>
                </GlassCard>
             )}

             {/* Languages */}
             {sections.languages.length > 0 && (
                <GlassCard delay={0.2}>
                   <SectionHeader icon={Globe} title="Languages" />
                   <div className="space-y-3">
                      {sections.languages.map((lang) => (
                         <div key={lang.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-white/5">
                            <span className="text-slate-200 font-medium">{lang.name}</span>
                            <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded-md">{lang.proficiency}</span>
                         </div>
                      ))}
                   </div>
                </GlassCard>
             )}

             {/* Certifications (Small List) */}
             {sections.certifications.length > 0 && (
                <GlassCard delay={0.3}>
                   <SectionHeader icon={Award} title="Certifications" />
                   <div className="space-y-4">
                      {sections.certifications.map((cert) => (
                         <div key={cert.id} className="group flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center border border-white/5 text-slate-500 group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors">
                               <Award size={18} />
                            </div>
                            <div>
                               <h4 className="text-sm font-semibold text-slate-200 leading-tight group-hover:text-blue-300 transition-colors">{cert.name}</h4>
                               <p className="text-xs text-slate-500 mt-1">{cert.issuer} • {formatDate(cert.issueDate)}</p>
                            </div>
                         </div>
                      ))}
                   </div>
                </GlassCard>
             )}

          </div>

          {/* Right Column (Main Content) */}
          <div className="lg:col-span-2 space-y-8">

             {/* Activity Heatmap */}
             {Object.keys(activityMap).length > 0 && (
                <GlassCard delay={0.2} className="relative overflow-hidden">
                   <SectionHeader icon={Sparkles} title="Committed to Growth" />
                   <div className="flex flex-wrap gap-1">
                      {heatmapDays.map((day) => {
                         const intensity = day.count > 6 ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" 
                                         : day.count > 3 ? "bg-emerald-500/80" 
                                         : day.count > 0 ? "bg-emerald-900/60" 
                                         : "bg-slate-800/50";
                         return (
                            <div 
                               key={day.key} 
                               className={`w-2.5 h-2.5 rounded-sm ${intensity} transition-all duration-300 hover:scale-125`} 
                               title={`${day.key}: ${day.count} activities`} 
                            />
                         );
                      })}
                   </div>
                   <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 font-medium tracking-wide">
                      <span>Less</span>
                      <div className="flex gap-1">
                         <div className="w-2.5 h-2.5 rounded-sm bg-slate-800/50" />
                         <div className="w-2.5 h-2.5 rounded-sm bg-emerald-900/60" />
                         <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500/80" />
                         <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                      </div>
                      <span>More</span>
                   </div>
                </GlassCard>
             )}

             {/* Experience */}
             {sections.experiences.length > 0 && (
                <GlassCard delay={0.4}>
                   <SectionHeader icon={Layers} title="Professional Journey" />
                   <div className="space-y-8 relative before:absolute before:top-4 before:bottom-4 before:left-[19px] before:w-0.5 before:bg-slate-800">
                      {sections.experiences.map((exp) => (
                         <div key={exp.id} className="relative pl-12 group">
                            <div className="absolute left-0 top-1.5 w-10 h-10 rounded-full border-4 border-slate-950 bg-slate-800 group-hover:bg-blue-600 transition-colors z-10 flex items-center justify-center">
                               <div className="w-2 h-2 rounded-full bg-slate-400 group-hover:bg-white transition-colors" />
                            </div>
                            <div className="p-5 rounded-2xl bg-slate-800/30 border border-white/5 hover:border-white/10 hover:bg-slate-800/50 transition-all">
                               <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                  <h4 className="text-lg font-bold text-white">{exp.role}</h4>
                                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-900/50 px-3 py-1 rounded-full">
                                     {formatDate(exp.startDate)} — {exp.endDate ? formatDate(exp.endDate) : "Present"}
                                  </span>
                               </div>
                               <p className="text-blue-400 font-medium text-sm mb-4">{exp.company}</p>
                               {splitBullets(exp.description).length > 0 && (
                                  <ul className="space-y-2">
                                     {splitBullets(exp.description).map((item, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-slate-400 leading-relaxed">
                                           <span className="text-slate-600 mt-1.5">•</span> {item}
                                        </li>
                                     ))}
                                  </ul>
                               )}
                            </div>
                         </div>
                      ))}
                   </div>
                </GlassCard>
             )}

             {/* Projects */}
             {sections.projects.length > 0 && (
                <GlassCard delay={0.5}>
                   <SectionHeader icon={Code} title="Featured Projects" />
                   <div className="grid md:grid-cols-2 gap-4">
                      {sections.projects.map((project) => (
                         <div key={project.id} className="group relative p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/5 hover:border-blue-500/30 transition-all hover:-translate-y-1 shadow-lg hover:shadow-blue-500/10">
                            <h4 className="text-base font-bold text-white mb-2">{project.title}</h4>
                            <p className="text-sm text-slate-400 line-clamp-3 mb-4">{project.description}</p>
                            
                            {project.techStack && (
                               <div className="flex flex-wrap gap-2 mb-6">
                                  {project.techStack.split(',').slice(0, 3).map((tech) => (
                                     <span key={tech} className="text-[10px] uppercase font-bold text-slate-500 bg-slate-950 px-2 py-1 rounded-md">
                                        {tech.trim()}
                                     </span>
                                  ))}
                               </div>
                            )}

                            <div className="flex gap-3 mt-auto">
                               {project.projectUrl && (
                                  <a href={project.projectUrl} target="_blank" rel="noreferrer" className="flex-1 py-2 text-xs font-bold uppercase tracking-wider text-center rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">
                                     Live Demo
                                  </a>
                               )}
                               {project.repoUrl && (
                                  <a href={project.repoUrl} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors">
                                     <Github size={16} />
                                  </a>
                               )}
                            </div>
                         </div>
                      ))}
                   </div>
                </GlassCard>
             )}
             
             {/* Education */}
             {sections.educations.length > 0 && (
                <GlassCard delay={0.6}>
                   <SectionHeader icon={BookOpen} title="Education" />
                   <div className="grid gap-4">
                      {sections.educations.map((edu) => (
                         <div key={edu.id} className="p-5 rounded-2xl bg-slate-800/30 border border-white/5 flex flex-col md:flex-row md:items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 border border-white/5 shrink-0">
                               <BookOpen size={20} />
                            </div>
                            <div className="flex-1">
                               <h4 className="text-base font-bold text-white">{edu.degree}</h4>
                               <p className="text-sm text-slate-400">{edu.institution}</p>
                            </div>
                            <div className="text-right">
                               <p className="text-sm font-bold text-slate-300">{edu.startYear} - {edu.endYear || "Present"}</p>
                               {edu.grade && <p className="text-xs text-slate-500 mt-1">Grade: {edu.grade}</p>}
                            </div>
                         </div>
                      ))}
                   </div>
                </GlassCard>
             )}

          </div>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={Boolean(preview)} onOpenChange={(open) => !open && setPreview(null)}>
        <DialogContent className="max-w-5xl h-[85vh] bg-slate-950 border-slate-800 p-0 overflow-hidden">
          <DialogHeader className="p-4 bg-slate-900 border-b border-white/5">
            <DialogTitle className="text-white flex items-center gap-2">
               <FileText size={18} className="text-blue-400" /> {preview?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="h-full w-full bg-slate-900/50">
             {preview?.url && (
               <iframe src={preview.url} title={preview.title} className="w-full h-full" />
             )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
