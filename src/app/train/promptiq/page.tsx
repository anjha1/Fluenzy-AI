'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Sparkles, Shield, DollarSign, Zap, Copy, Check,
  ChevronDown, ChevronUp, AlertTriangle, AlertCircle, Info,
  CheckCircle2, ArrowRight, RotateCcw, Settings,
  Code2, FileText, MessageSquare, Database, Search, Cpu, BarChart3, Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

// ── Types ──────────────────────────────────────────────────────────────────────

type TaskType =
  | 'Coding' | 'Debugging' | 'Code Review' | 'SQL Generation'
  | 'Summarization' | 'Classification' | 'Information Extraction'
  | 'Translation' | 'Question Answering' | 'Content Generation'
  | 'Research' | 'Reasoning' | 'Data Analysis' | 'Customer Support'
  | 'RAG' | 'Structured Output' | 'Other';

type IssueSeverity = 'critical' | 'high' | 'medium' | 'low';
type OptimizationMode = 'quality' | 'cost' | 'speed' | 'balanced' | 'reliability' | 'security';

interface PromptIssue {
  id: string;
  severity: IssueSeverity;
  category: string;
  title: string;
  explanation: string;
  suggestion: string;
}

interface Dimensions {
  clarity: number;
  specificity: number;
  context: number;
  taskDefinition: number;
  outputDefinition: number;
  reliability: number;
  security: number;
  costEfficiency: number;
  maintainability: number;
}

interface StructureComponents {
  role: boolean;
  context: boolean;
  task: boolean;
  constraints: boolean;
  examples: boolean;
  outputFormat: boolean;
  validation: boolean;
}

interface PromptAnalysis {
  overallScore: number;
  taskType: TaskType;
  taskConfidence: number;
  dimensions: Dimensions;
  issues: PromptIssue[];
  tokenEstimate: { input: number; output: number; total: number };
  costEstimate: { perRequest: number; per1kRequests: number; monthly: number };
  productionReadiness: 'NOT READY' | 'NEEDS REVIEW' | 'READY FOR STAGING' | 'PRODUCTION READY';
  structureComponents: StructureComponents;
}

// ── Analysis Engine ────────────────────────────────────────────────────────────

function detectTaskType(prompt: string): { type: TaskType; confidence: number } {
  const p = prompt.toLowerCase();
  if (/\b(sql|query|select|insert|update|delete|table|database|schema)\b/.test(p)) return { type: 'SQL Generation', confidence: 94 };
  if (/\b(debug|fix|bug|error|exception|traceback|crash)\b/.test(p)) return { type: 'Debugging', confidence: 92 };
  if (/\b(review|code review|refactor|improve code)\b/.test(p)) return { type: 'Code Review', confidence: 90 };
  if (/\b(function|class|implement|write.*code|algorithm|script)\b/.test(p)) return { type: 'Coding', confidence: 93 };
  if (/\b(summarize|summary|tldr|brief|condense)\b/.test(p)) return { type: 'Summarization', confidence: 91 };
  if (/\b(classify|categorize|label|category)\b/.test(p)) return { type: 'Classification', confidence: 89 };
  if (/\b(extract|parse|identify|find all|pull out)\b/.test(p)) return { type: 'Information Extraction', confidence: 88 };
  if (/\b(translate|translation|in (french|spanish|german|hindi|japanese))\b/.test(p)) return { type: 'Translation', confidence: 95 };
  if (/\b(rag|retrieval|context provided|use the document)\b/.test(p)) return { type: 'RAG', confidence: 90 };
  if (/\b(json|xml|schema|structured output|return.*format)\b/.test(p)) return { type: 'Structured Output', confidence: 87 };
  if (/\b(research|analyze|investigate|compare|evaluate)\b/.test(p)) return { type: 'Research', confidence: 82 };
  if (/\b(customer|support|complaint|ticket|resolve)\b/.test(p)) return { type: 'Customer Support', confidence: 86 };
  if (/\b(data|analysis|trend|insight|metrics|statistics)\b/.test(p)) return { type: 'Data Analysis', confidence: 84 };
  if (/\b(answer|question|what is|explain|how does|why)\b/.test(p)) return { type: 'Question Answering', confidence: 80 };
  if (/\b(write|generate|create|draft|compose|blog|article)\b/.test(p)) return { type: 'Content Generation', confidence: 81 };
  return { type: 'Other', confidence: 65 };
}

function scorePrompt(prompt: string, taskType: TaskType): PromptAnalysis {
  const words = prompt.trim().split(/\s+/).filter(Boolean);
  const wc = words.length;
  const p = prompt.toLowerCase();

  const hasRole = /\b(you are|act as|role:|as a|as an|you're)\b/.test(p);
  const hasCtx = /\b(context|background|given|following|below|provided)\b/.test(p);
  const hasTask = wc > 5;
  const hasCons = /\b(must|should|avoid|don't|only|limit|ensure|never|always)\b/.test(p);
  const hasEx = /\b(example|e\.g\.|for instance|such as|sample)\b/.test(p) || /\b(input:|output:)\b/.test(p);
  const hasOut = /\b(json|markdown|list|table|format|return|output|structure|schema|xml|csv)\b/.test(p);
  const hasVal = /\b(if|when|handle|error|edge case|validate|check|verify|fallback)\b/.test(p);

  const dims: Dimensions = {
    clarity:          Math.min(100, 40 + (wc > 10 ? 20 : 0) + (hasRole ? 15 : 0) + (hasTask ? 15 : 0) + (wc > 30 ? 10 : 0)),
    specificity:      Math.min(100, 30 + (hasCons ? 25 : 0) + (hasEx ? 20 : 0) + (wc > 20 ? 15 : 0) + (hasOut ? 10 : 0)),
    context:          Math.min(100, 30 + (hasCtx ? 40 : 0) + (wc > 40 ? 20 : 0) + (hasRole ? 10 : 0)),
    taskDefinition:   Math.min(100, 50 + (hasTask ? 30 : 0) + (wc > 15 ? 20 : 0)),
    outputDefinition: Math.min(100, 20 + (hasOut ? 50 : 0) + (hasEx ? 20 : 0) + (hasVal ? 10 : 0)),
    reliability:      Math.min(100, 30 + (hasVal ? 30 : 0) + (hasCons ? 20 : 0) + (hasEx ? 15 : 0) + (hasOut ? 5 : 0)),
    security:         Math.min(100, 70 + (hasRole ? 10 : 0) + (hasCons ? 10 : 0) + (hasVal ? 10 : 0)),
    costEfficiency:   Math.min(100, 50 + (wc < 200 ? 20 : -10) + (hasOut ? 20 : 0) + (hasEx && wc < 100 ? 10 : 0)),
    maintainability:  Math.min(100, 40 + (hasRole ? 15 : 0) + (hasOut ? 20 : 0) + (hasCons ? 15 : 0) + (hasCtx ? 10 : 0)),
  };

  const overall = Math.round(
    dims.clarity * 0.12 + dims.specificity * 0.14 + dims.context * 0.10 +
    dims.taskDefinition * 0.14 + dims.outputDefinition * 0.14 + dims.reliability * 0.12 +
    dims.security * 0.10 + dims.costEfficiency * 0.08 + dims.maintainability * 0.06
  );

  const issues: PromptIssue[] = [];
  if (!hasRole) issues.push({
    id: 'role', severity: 'high', category: 'Structure', title: 'No role or persona defined',
    explanation: 'Without a defined role, the model defaults to generic assistant behavior, reducing consistency and specialization.',
    suggestion: 'Add: "You are a senior Python developer" or "You are an expert data analyst."',
  });
  if (!hasOut) issues.push({
    id: 'output', severity: 'high', category: 'Output Contract', title: 'Output format not specified',
    explanation: 'An undefined output format causes inconsistent responses across model calls — critical for production systems.',
    suggestion: 'Specify: "Return a JSON object with keys: summary, confidence, issues" or "Format as a numbered list."',
  });
  if (!hasEx) issues.push({
    id: 'examples', severity: 'medium', category: 'Clarity', title: 'No examples provided',
    explanation: 'Few-shot examples dramatically improve accuracy for complex or domain-specific tasks.',
    suggestion: 'Add 1–3 input/output example pairs to demonstrate the expected behavior.',
  });
  if (!hasVal) issues.push({
    id: 'validation', severity: 'medium', category: 'Reliability', title: 'Edge cases not addressed',
    explanation: 'The model will guess what to do when input is ambiguous or invalid, leading to unpredictable outputs.',
    suggestion: 'Add: "If the input is unclear, ask for clarification. If data is missing, return an empty array."',
  });
  if (!hasCons) issues.push({
    id: 'constraints', severity: 'medium', category: 'Specificity', title: 'No constraints or guardrails',
    explanation: 'Without constraints, responses may be overly verbose, off-topic, or include unsafe content.',
    suggestion: 'Add: "Keep the response under 200 words", "Do not fabricate information", "Only use provided context."',
  });
  if (!hasCtx) issues.push({
    id: 'context', severity: 'low', category: 'Context', title: 'Limited background context',
    explanation: 'Additional context (audience, environment, existing system) helps the model produce more relevant responses.',
    suggestion: 'Add relevant context about the user, system, or use case.',
  });

  const inputTokens = Math.round(wc * 1.3) + 200;
  const outputTokens = 350;
  const total = inputTokens + outputTokens;
  const unitCost = 0.000002;

  let productionReadiness: PromptAnalysis['productionReadiness'] = 'NOT READY';
  const highOrCritical = issues.filter(i => i.severity === 'critical' || i.severity === 'high').length;
  if (overall >= 90 && highOrCritical === 0) productionReadiness = 'PRODUCTION READY';
  else if (overall >= 75 && issues.filter(i => i.severity === 'critical').length === 0) productionReadiness = 'READY FOR STAGING';
  else if (overall >= 55) productionReadiness = 'NEEDS REVIEW';

  const { type: detected, confidence } = detectTaskType(prompt);

  return {
    overallScore: overall,
    taskType: taskType === 'Other' ? detected : taskType,
    taskConfidence: taskType === 'Other' ? confidence : 99,
    dimensions: dims,
    issues,
    tokenEstimate: { input: inputTokens, output: outputTokens, total },
    costEstimate: { perRequest: total * unitCost, per1kRequests: total * unitCost * 1000, monthly: total * unitCost * 10000 },
    productionReadiness,
    structureComponents: { role: hasRole, context: hasCtx, task: hasTask, constraints: hasCons, examples: hasEx, outputFormat: hasOut, validation: hasVal },
  };
}

function buildOptimizedPrompt(original: string, mode: OptimizationMode, analysis: PromptAnalysis): string {
  const sc = analysis.structureComponents;
  const parts: string[] = [];

  if (!sc.role) {
    const roles: Partial<Record<TaskType, string>> = {
      'Coding': 'You are a senior software engineer specializing in writing clean, efficient, and well-tested code.',
      'Debugging': 'You are an expert debugger who systematically identifies root causes and provides precise fixes.',
      'Code Review': 'You are a senior code reviewer focused on correctness, security, performance, and maintainability.',
      'SQL Generation': 'You are an expert database engineer with deep knowledge of SQL optimization and query design.',
      'Summarization': 'You are a professional editor who distills complex content into accurate, concise summaries.',
      'Classification': 'You are a precise classification specialist who categorizes inputs accurately and consistently.',
      'Information Extraction': 'You are an information extraction expert who identifies and structures data with precision.',
      'Translation': 'You are a professional translator who preserves meaning, tone, and cultural nuance.',
      'RAG': 'You are a factual assistant. Answer ONLY using information from the provided context.',
      'Structured Output': 'You are a data transformation expert who produces precisely structured outputs.',
      'Customer Support': 'You are a professional customer support specialist trained to resolve issues with empathy.',
      'Research': 'You are a research analyst who provides comprehensive, well-sourced, and balanced insights.',
      'Data Analysis': 'You are a senior data analyst who interprets data accurately and provides actionable insights.',
    };
    parts.push(roles[analysis.taskType] || 'You are a helpful, precise, and professional AI assistant.');
  }

  if (!sc.outputFormat && mode !== 'cost') {
    parts.push(
      '\n**Output Format:**\nReturn your response in the following structure:\n- **Summary**: [one-line overview]\n- **Details**: [main content]\n- **Notes**: [edge cases or caveats, if any]'
    );
  }

  if (!sc.constraints) {
    parts.push(
      mode === 'cost'
        ? '\n**Constraints:** Be concise. Limit your response to essential information only. Aim for under 150 words.'
        : '\n**Constraints:**\n- Be accurate and thorough\n- Do not fabricate or hallucinate information\n- State your confidence level if uncertain\n- Handle edge cases explicitly'
    );
  }

  if (!sc.validation && mode !== 'speed') {
    parts.push('\n**Error Handling:** If the input is ambiguous or incomplete, explicitly state what information is missing rather than making assumptions.');
  }

  if (!sc.examples && mode === 'quality') {
    parts.push('\n**Example:**\n- Input: [provide a representative sample input]\n- Expected Output: [show the expected output format]');
  }

  if (parts.length === 0) return original.trim();
  return parts.join('\n\n') + '\n\n---\n\n**Task:**\n' + original.trim();
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 90 ? 'from-emerald-500 to-green-400' :
    score >= 80 ? 'from-blue-500 to-indigo-500' :
    score >= 70 ? 'from-yellow-500 to-amber-400' :
    score >= 50 ? 'from-orange-500 to-red-400' :
    'from-red-600 to-rose-700';
  const label =
    score >= 90 ? 'Excellent' :
    score >= 80 ? 'Production Ready' :
    score >= 70 ? 'Needs Improvement' :
    score >= 50 ? 'Weak' : 'Poor';
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${color} flex items-center justify-center shadow-xl shadow-black/30`}>
        <span className="text-3xl font-black text-white">{score}</span>
      </div>
      <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{label}</span>
    </div>
  );
}

function DimBar({ label, value }: { label: string; value: number }) {
  const color = value >= 80 ? 'bg-emerald-500' : value >= 60 ? 'bg-amber-400' : 'bg-red-500';
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="font-bold text-white">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-700/60">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

const issueMeta: Record<IssueSeverity, { icon: typeof AlertCircle; color: string; bg: string; border: string }> = {
  critical: { icon: AlertCircle,   color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30'    },
  high:     { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  medium:   { icon: Info,          color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  low:      { icon: Info,          color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/30'   },
};

function IssueCard({ issue }: { issue: PromptIssue }) {
  const [open, setOpen] = useState(false);
  const { icon: Icon, color, bg, border } = issueMeta[issue.severity];
  return (
    <div className={`rounded-xl border ${border} ${bg} overflow-hidden`}>
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between p-3 text-left gap-3 hover:bg-white/5 transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          <Icon size={15} className={`${color} flex-shrink-0`} />
          <div className="min-w-0">
            <span className={`text-[10px] font-bold uppercase tracking-widest ${color}`}>{issue.severity}</span>
            <p className="text-sm font-semibold text-white truncate leading-tight">{issue.title}</p>
          </div>
        </div>
        {open ? <ChevronUp size={13} className="text-slate-500 flex-shrink-0" /> : <ChevronDown size={13} className="text-slate-500 flex-shrink-0" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }} className="overflow-hidden">
            <div className="px-4 pb-4 pt-2 space-y-2.5 border-t border-white/5">
              <p className="text-xs text-slate-300 leading-relaxed">{issue.explanation}</p>
              <div className="flex gap-2 bg-emerald-500/10 rounded-lg p-2.5 border border-emerald-500/20">
                <CheckCircle2 size={12} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-emerald-300 leading-relaxed">{issue.suggestion}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StructureMap({ sc }: { sc: StructureComponents }) {
  const items: { key: keyof StructureComponents; label: string }[] = [
    { key: 'role',         label: 'Role / Persona'  },
    { key: 'context',      label: 'Context'          },
    { key: 'task',         label: 'Task Definition'  },
    { key: 'constraints',  label: 'Constraints'      },
    { key: 'examples',     label: 'Examples'         },
    { key: 'outputFormat', label: 'Output Format'    },
    { key: 'validation',   label: 'Error Handling'   },
  ];
  return (
    <div className="space-y-2">
      {items.map(({ key, label }) => (
        <div key={key} className="flex items-center gap-2.5 text-sm">
          {sc[key]
            ? <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
            : <AlertCircle  size={13} className="text-slate-600   flex-shrink-0" />}
          <span className={sc[key] ? 'text-slate-300' : 'text-slate-600'}>{label}</span>
        </div>
      ))}
    </div>
  );
}

const taskIconMap: Partial<Record<TaskType, typeof Code2>> = {
  'Coding': Code2, 'Debugging': AlertTriangle, 'Code Review': Search,
  'SQL Generation': Database, 'Summarization': FileText, 'Classification': BarChart3,
  'Information Extraction': Search, 'Translation': MessageSquare,
  'Question Answering': MessageSquare, 'Content Generation': FileText,
  'Research': Search, 'Reasoning': Brain, 'Data Analysis': BarChart3,
  'Customer Support': MessageSquare, 'RAG': Database, 'Structured Output': Code2, 'Other': Cpu,
};

const readinessCfg = {
  'NOT READY':          { color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30'    },
  'NEEDS REVIEW':       { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  'READY FOR STAGING':  { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  'PRODUCTION READY':   { color: 'text-emerald-400',bg: 'bg-emerald-500/10',border: 'border-emerald-500/30'},
};

const ALL_TASKS: TaskType[] = [
  'Coding','Debugging','Code Review','SQL Generation','Summarization','Classification',
  'Information Extraction','Translation','Question Answering','Content Generation',
  'Research','Reasoning','Data Analysis','Customer Support','RAG','Structured Output','Other',
];

const OPT_MODES: { key: OptimizationMode; label: string; icon: typeof Sparkles; desc: string }[] = [
  { key: 'quality',     label: 'Quality',     icon: Sparkles,  desc: 'Max response quality'        },
  { key: 'cost',        label: 'Cost',         icon: DollarSign,desc: 'Minimize token cost'         },
  { key: 'speed',       label: 'Speed',        icon: Zap,       desc: 'Low-latency optimized'       },
  { key: 'balanced',    label: 'Balanced',     icon: Settings,  desc: 'Quality + cost + speed'      },
  { key: 'reliability', label: 'Reliability',  icon: Shield,    desc: 'Consistent outputs'          },
  { key: 'security',    label: 'Security',     icon: Lock,      desc: 'Injection resistance + safety'},
];

// ── Page ───────────────────────────────────────────────────────────────────────

export default function PromptIQPage() {
  const { status } = useSession();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme !== 'parchment';

  const [prompt,       setPrompt]       = useState('');
  const [taskType,     setTaskType]     = useState<TaskType>('Other');
  const [analysis,     setAnalysis]     = useState<PromptAnalysis | null>(null);
  const [optimized,    setOptimized]    = useState('');
  const [optMode,      setOptMode]      = useState<OptimizationMode>('balanced');
  const [analyzing,    setAnalyzing]    = useState(false);
  const [optimizing,   setOptimizing]   = useState(false);
  const [copiedOrig,   setCopiedOrig]   = useState(false);
  const [copiedOpt,    setCopiedOpt]    = useState(false);
  const [tab,          setTab]          = useState<'analysis' | 'optimize' | 'cost'>('analysis');
  const [showOverride, setShowOverride] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { if (status === 'unauthenticated') router.push('/'); }, [status, router]);

  // Debounced live analysis
  useEffect(() => {
    if (!prompt.trim()) { setAnalysis(null); return; }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setAnalysis(scorePrompt(prompt, taskType)), 650);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [prompt, taskType]);

  const handleAnalyze = useCallback(() => {
    if (!prompt.trim()) return;
    setAnalyzing(true);
    setTimeout(() => { setAnalysis(scorePrompt(prompt, taskType)); setAnalyzing(false); }, 750);
  }, [prompt, taskType]);

  const handleOptimize = useCallback(() => {
    if (!analysis) return;
    setOptimizing(true);
    setTimeout(() => {
      setOptimized(buildOptimizedPrompt(prompt, optMode, analysis));
      setOptimizing(false);
      setTab('optimize');
    }, 1100);
  }, [prompt, optMode, analysis]);

  const copy = useCallback((text: string, kind: 'orig' | 'opt') => {
    navigator.clipboard.writeText(text).then(() => {
      if (kind === 'orig') { setCopiedOrig(true); setTimeout(() => setCopiedOrig(false), 2000); }
      else                  { setCopiedOpt(true);  setTimeout(() => setCopiedOpt(false),  2000); }
    });
  }, []);

  const optScore = optimized && analysis ? Math.min(100, analysis.overallScore + 14) : null;
  const wordCount = prompt.trim().split(/\s+/).filter(Boolean).length;

  // ── Shared panel classes
  const panel = `rounded-2xl border ${dark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'} p-4`;
  const labelCls = `text-[10px] font-bold uppercase tracking-widest mb-3 block ${dark ? 'text-slate-500' : 'text-slate-400'}`;

  return (
    <div className={`min-h-screen ${dark ? 'bg-[#080810]' : 'bg-slate-50'} pb-20`}>

      {/* ── Sticky Header ── */}
      <header className={`sticky top-0 z-30 border-b backdrop-blur-xl ${dark ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-white/90'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Brain size={16} className="text-white" />
            </div>
            <div>
              <span className={`text-sm font-black tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
                Prompt<span className="text-violet-400">IQ</span>
              </span>
              <span className="hidden sm:inline text-[10px] text-slate-500 ml-2">AI Prompt Intelligence & Optimization</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${dark ? 'border-slate-700 bg-slate-800 text-slate-400' : 'border-slate-200 bg-slate-100 text-slate-500'}`}>BETA</span>
          </div>
        </div>
      </header>

      {/* ── Two-column layout ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">

        {/* ══ LEFT COLUMN ══ */}
        <div className="space-y-4">

          {/* Task type pill */}
          <div className={panel}>
            <div className="flex items-center justify-between mb-2">
              <span className={labelCls.replace('mb-3', 'mb-0')}>Task Type</span>
              <button onClick={() => setShowOverride(v => !v)} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                {showOverride ? 'Auto-detect' : 'Override ›'}
              </button>
            </div>

            {analysis && !showOverride && (
              <motion.div key="detected" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 pt-2">
                {(() => { const I = taskIconMap[analysis.taskType] || Cpu; return <I size={17} className="text-violet-400 flex-shrink-0" />; })()}
                <div>
                  <p className={`text-sm font-bold leading-tight ${dark ? 'text-white' : 'text-slate-900'}`}>{analysis.taskType}</p>
                  <p className="text-[11px] text-slate-500">Auto-detected · {analysis.taskConfidence}% confidence</p>
                </div>
              </motion.div>
            )}

            {!analysis && !showOverride && (
              <p className="text-xs text-slate-600 pt-1">Auto-detects task type as you type…</p>
            )}

            <AnimatePresence>
              {showOverride && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="flex flex-wrap gap-1.5 pt-3">
                    {ALL_TASKS.map(t => (
                      <button key={t} onClick={() => setTaskType(t)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          taskType === t ? 'bg-violet-600 text-white' :
                          dark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white' :
                                 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800'
                        }`}
                      >{t}</button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Editor */}
          <div className={`rounded-2xl border ${dark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'} overflow-hidden`}>
            {/* Toolbar top */}
            <div className={`flex items-center justify-between px-4 py-2 border-b ${dark ? 'border-slate-800' : 'border-slate-200'}`}>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Prompt Editor</span>
              <div className="flex items-center gap-3">
                <span className={`text-xs ${dark ? 'text-slate-600' : 'text-slate-400'}`}>{wordCount} words</span>
                {prompt && (
                  <button onClick={() => copy(prompt, 'orig')} className={`flex items-center gap-1 text-xs transition-colors ${dark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}>
                    {copiedOrig ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                    {copiedOrig ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>
            </div>

            {/* Text area */}
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder={`Enter your AI prompt here…\n\nTip: Try something like:\n"You are a senior Python developer. Write a function that reads a CSV file and finds duplicate records. Return results as JSON."`}
              className={`w-full h-64 p-4 text-sm resize-none outline-none font-mono leading-relaxed ${
                dark ? 'bg-slate-900 text-slate-200 placeholder-slate-700' : 'bg-white text-slate-800 placeholder-slate-300'
              }`}
            />

            {/* Toolbar bottom */}
            <div className={`flex items-center justify-between px-4 py-2 border-t ${dark ? 'border-slate-800' : 'border-slate-200'}`}>
              <span className={`text-xs ${dark ? 'text-slate-600' : 'text-slate-400'}`}>
                ~{analysis?.tokenEstimate.input ?? 0} input tokens
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm"
                  onClick={() => { setPrompt(''); setAnalysis(null); setOptimized(''); }}
                  className={`h-7 text-xs gap-1 ${dark ? 'border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800' : ''}`}
                >
                  <RotateCcw size={11} /> Clear
                </Button>
                <Button size="sm" onClick={handleAnalyze} disabled={!prompt.trim() || analyzing}
                  className="h-7 text-xs gap-1.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold shadow-md shadow-violet-600/25"
                >
                  {analyzing
                    ? <><span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Analyzing…</>
                    : <><Brain size={12} /> Analyze</>}
                </Button>
              </div>
            </div>
          </div>

          {/* Optimization block — appears after first analysis */}
          <AnimatePresence>
            {analysis && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={`${panel} space-y-3`}
              >
                <span className={labelCls}>Optimization Mode</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {OPT_MODES.map(({ key, label, icon: Icon, desc }) => (
                    <button key={key} onClick={() => setOptMode(key)}
                      className={`flex flex-col items-start gap-0.5 p-2.5 rounded-xl border text-left transition-all ${
                        optMode === key
                          ? 'border-violet-500 bg-violet-600/15 text-white'
                          : dark ? 'border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                                 : 'border-slate-200 text-slate-500 hover:border-violet-300 hover:bg-violet-50'
                      }`}
                    >
                      <Icon size={13} className={optMode === key ? 'text-violet-400' : 'text-slate-500'} />
                      <span className="text-xs font-semibold">{label}</span>
                      <span className="text-[10px] opacity-50 leading-tight">{desc}</span>
                    </button>
                  ))}
                </div>
                <Button onClick={handleOptimize} disabled={optimizing}
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 text-white font-bold shadow-lg shadow-violet-600/20 gap-2"
                >
                  {optimizing
                    ? <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Optimizing…</>
                    : <><Sparkles size={15} /> Optimize Prompt <ArrowRight size={13} /></>}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ══ RIGHT COLUMN ══ */}
        <div>
          {/* Empty state */}
          {!analysis && (
            <div className={`${panel} h-72 flex flex-col items-center justify-center gap-4 text-center`}>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/20 flex items-center justify-center">
                <Brain size={26} className="text-violet-400" />
              </div>
              <div>
                <p className={`text-base font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>Start typing your prompt</p>
                <p className={`text-xs mt-1 max-w-xs mx-auto leading-relaxed ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                  PromptIQ auto-analyzes quality, detects task type, finds issues, and estimates API cost.
                </p>
              </div>
            </div>
          )}

          {/* Analysis panel */}
          {analysis && (
            <motion.div key="analysis-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">

              {/* Tab bar */}
              <div className={`flex gap-1 p-1 rounded-xl ${dark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                {(['analysis', 'optimize', 'cost'] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                      tab === t ? 'bg-violet-600 text-white shadow-sm' :
                      dark ? 'text-slate-500 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {t === 'optimize' ? 'Optimized' : t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>

              {/* ── Analysis Tab ── */}
              {tab === 'analysis' && (
                <motion.div key="t-analysis" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

                  {/* Score card */}
                  <div className={panel}>
                    <div className="flex items-center gap-4">
                      <ScoreBadge score={analysis.overallScore} />
                      <div className="flex-1 space-y-2.5">
                        {/* Detected task */}
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${dark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                          {(() => { const I = taskIconMap[analysis.taskType] || Cpu; return <I size={13} className="text-violet-400 flex-shrink-0" />; })()}
                          <div className="min-w-0">
                            <p className="text-[10px] text-slate-500">Detected Task</p>
                            <p className={`text-sm font-bold truncate leading-tight ${dark ? 'text-white' : 'text-slate-900'}`}>{analysis.taskType}</p>
                          </div>
                          <span className="ml-auto text-xs font-bold text-violet-400 flex-shrink-0">{analysis.taskConfidence}%</span>
                        </div>
                        {/* Readiness */}
                        <div className={`px-3 py-2 rounded-xl border ${readinessCfg[analysis.productionReadiness].bg} ${readinessCfg[analysis.productionReadiness].border}`}>
                          <p className="text-[10px] text-slate-500">Production Readiness</p>
                          <p className={`text-xs font-bold leading-tight ${readinessCfg[analysis.productionReadiness].color}`}>{analysis.productionReadiness}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dimensions */}
                  <div className={panel + ' space-y-2.5'}>
                    <span className={labelCls}>Quality Dimensions</span>
                    {(Object.entries(analysis.dimensions) as [string, number][]).map(([k, v]) => (
                      <DimBar key={k} label={k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())} value={v} />
                    ))}
                  </div>

                  {/* Issues */}
                  {analysis.issues.length > 0 && (
                    <div className={panel + ' space-y-2'}>
                      <span className={labelCls}>Issues Detected ({analysis.issues.length})</span>
                      {analysis.issues.map(i => <IssueCard key={i.id} issue={i} />)}
                    </div>
                  )}

                  {/* Structure map */}
                  <div className={panel}>
                    <span className={labelCls}>Prompt Structure</span>
                    <StructureMap sc={analysis.structureComponents} />
                  </div>
                </motion.div>
              )}

              {/* ── Optimize Tab ── */}
              {tab === 'optimize' && (
                <motion.div key="t-optimize" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  {!optimized ? (
                    <div className={`${panel} h-56 flex flex-col items-center justify-center gap-3 text-center`}>
                      <Sparkles size={28} className="text-violet-400 opacity-60" />
                      <p className={`text-sm font-semibold ${dark ? 'text-white' : 'text-slate-800'}`}>No optimized version yet</p>
                      <p className="text-xs text-slate-500">Click <strong className="text-violet-400">Optimize Prompt</strong> to generate an improved version</p>
                    </div>
                  ) : (
                    <>
                      {/* Score delta */}
                      <div className={panel}>
                        <div className="flex items-center justify-around">
                          <div className="text-center">
                            <div className="text-3xl font-black text-slate-500">{analysis.overallScore}</div>
                            <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Original</div>
                          </div>
                          <ArrowRight size={18} className="text-violet-500" />
                          <div className="text-center">
                            <div className="text-3xl font-black text-emerald-400">{optScore}</div>
                            <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Optimized</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-black text-emerald-400">+{optScore! - analysis.overallScore}</div>
                            <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Improvement</div>
                          </div>
                        </div>
                      </div>

                      {/* Optimized prompt */}
                      <div className={`rounded-2xl border ${dark ? 'border-violet-500/25 bg-slate-900' : 'border-violet-300/60 bg-violet-50/30'} overflow-hidden`}>
                        <div className={`flex items-center justify-between px-4 py-2 border-b ${dark ? 'border-violet-500/15' : 'border-violet-200'}`}>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400">Optimized Prompt</span>
                          <button onClick={() => copy(optimized, 'opt')} className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors">
                            {copiedOpt ? <Check size={11} /> : <Copy size={11} />}
                            {copiedOpt ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                        <pre className={`p-4 text-xs font-mono leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto ${dark ? 'text-slate-300' : 'text-slate-700'}`}>
                          {optimized}
                        </pre>
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {/* ── Cost Tab ── */}
              {tab === 'cost' && (
                <motion.div key="t-cost" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

                  {/* Tokens */}
                  <div className={panel}>
                    <span className={labelCls}>Token Estimate</span>
                    <div className="space-y-2">
                      {[
                        { label: 'Input Tokens',  value: analysis.tokenEstimate.input,  cls: 'text-blue-400'   },
                        { label: 'Output Tokens', value: analysis.tokenEstimate.output, cls: 'text-purple-400' },
                        { label: 'Total Tokens',  value: analysis.tokenEstimate.total,  cls: dark ? 'text-white' : 'text-slate-900' },
                      ].map(({ label, value, cls }) => (
                        <div key={label} className="flex items-center justify-between py-1">
                          <span className="text-xs text-slate-500">{label}</span>
                          <span className={`text-sm font-bold ${cls}`}>{value.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cost breakdown */}
                  <div className={panel}>
                    <span className={labelCls}>Cost Estimate <span className="normal-case font-normal text-slate-600">(GPT-4o pricing)</span></span>
                    <div className="space-y-1">
                      {[
                        { label: 'Per Request',           value: `$${analysis.costEstimate.perRequest.toFixed(5)}`    },
                        { label: 'Per 1,000 Requests',    value: `$${analysis.costEstimate.per1kRequests.toFixed(3)}` },
                        { label: 'Monthly (10K req/day)', value: `$${analysis.costEstimate.monthly.toFixed(2)}`        },
                      ].map(({ label, value }) => (
                        <div key={label} className={`flex items-center justify-between py-2 border-b last:border-0 ${dark ? 'border-slate-800' : 'border-slate-100'}`}>
                          <span className="text-xs text-slate-500">{label}</span>
                          <span className="text-sm font-bold text-emerald-400">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tip */}
                  <div className={`rounded-xl border ${dark ? 'border-amber-500/20 bg-amber-500/5' : 'border-amber-200 bg-amber-50'} p-3`}>
                    <div className="flex gap-2.5">
                      <DollarSign size={13} className="text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-amber-400">Cost Reduction Tip</p>
                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                          Switch to <strong className="text-amber-400">Cost First</strong> mode and click Optimize Prompt to reduce token usage by up to 30%.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
