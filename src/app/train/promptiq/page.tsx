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
  Shuffle, ExternalLink, ImageIcon, ListChecks, Target,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import Image from 'next/image';

// â”€â”€ Challenge Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface SubTask {
  id: string;
  label: string;
  keywords: string[];
}

interface Challenge {
  id: string;
  category: string;
  title: string;
  description: string;
  image: string;
  color: string;
  gradient: string;
  taskType: string;
  tasks: { task: string; subTasks: SubTask[] }[];
}

const CHALLENGES: Challenge[] = [
  {
    id: 'hospital',
    category: 'Healthcare',
    title: 'Hospital Management Website',
    description: 'Build a modern healthcare platform for patients and staff',
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&q=80',
    color: 'text-blue-400',
    gradient: 'from-blue-500 to-cyan-500',
    taskType: 'Coding',
    tasks: [
      {
        task: 'Build a patient appointment booking system with doctor availability slots',
        subTasks: [
          { id: 'role', label: 'Define the AI role (e.g., healthcare developer)', keywords: ['you are', 'act as', 'developer', 'healthcare', 'medical'] },
          { id: 'booking', label: 'Mention booking/scheduling logic', keywords: ['book', 'appointment', 'schedule', 'slot', 'calendar', 'availability'] },
          { id: 'doctor', label: 'Specify doctor/specialist selection', keywords: ['doctor', 'specialist', 'physician', 'department'] },
          { id: 'validation', label: 'Include form validation requirements', keywords: ['validate', 'error', 'required', 'form', 'input'] },
          { id: 'output', label: 'Define the output format (HTML/React/etc.)', keywords: ['html', 'react', 'next', 'vue', 'component', 'page', 'code'] },
          { id: 'responsive', label: 'Mention responsive/mobile design', keywords: ['responsive', 'mobile', 'tailwind', 'css', 'design'] },
        ],
      },
      {
        task: 'Create a doctor directory page with specialty filters and profile cards',
        subTasks: [
          { id: 'role', label: 'Define the developer role', keywords: ['you are', 'act as', 'developer', 'engineer'] },
          { id: 'directory', label: 'Mention directory/listing layout', keywords: ['directory', 'list', 'grid', 'card', 'profile'] },
          { id: 'filter', label: 'Specify filter/search functionality', keywords: ['filter', 'search', 'specialty', 'department', 'sort'] },
          { id: 'profile', label: 'Describe doctor profile card contents', keywords: ['name', 'photo', 'specialty', 'experience', 'rating', 'bio'] },
          { id: 'output', label: 'Define output format', keywords: ['html', 'react', 'component', 'page', 'code'] },
        ],
      },
      {
        task: 'Design an emergency services page with real-time bed availability',
        subTasks: [
          { id: 'role', label: 'Define the role', keywords: ['you are', 'act as', 'developer'] },
          { id: 'emergency', label: 'Address emergency/urgent care context', keywords: ['emergency', 'urgent', 'critical', 'ambulance', 'icu'] },
          { id: 'realtime', label: 'Mention live/real-time data', keywords: ['real-time', 'live', 'update', 'websocket', 'refresh', 'dynamic'] },
          { id: 'beds', label: 'Specify bed/ward availability display', keywords: ['bed', 'ward', 'icu', 'available', 'capacity'] },
          { id: 'output', label: 'Define output format', keywords: ['html', 'react', 'component', 'page', 'code', 'dashboard'] },
        ],
      },
    ],
  },
  {
    id: 'restaurant',
    category: 'Food & Beverage',
    title: 'Restaurant Ordering Platform',
    description: 'Create an online food ordering and table reservation system',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    color: 'text-orange-400',
    gradient: 'from-orange-500 to-red-500',
    taskType: 'Coding',
    tasks: [
      {
        task: 'Build an interactive menu page with categories, filters, and cart functionality',
        subTasks: [
          { id: 'role', label: 'Define the developer role', keywords: ['you are', 'act as', 'developer', 'engineer'] },
          { id: 'menu', label: 'Mention menu/food items display', keywords: ['menu', 'food', 'dish', 'item', 'category'] },
          { id: 'cart', label: 'Include cart/order functionality', keywords: ['cart', 'order', 'add', 'quantity', 'checkout'] },
          { id: 'filter', label: 'Specify dietary filters (veg/non-veg)', keywords: ['filter', 'veg', 'vegetarian', 'allergen', 'search', 'sort'] },
          { id: 'output', label: 'Define output format', keywords: ['html', 'react', 'component', 'page', 'code'] },
          { id: 'design', label: 'Mention UI/design requirements', keywords: ['design', 'image', 'photo', 'ui', 'card', 'responsive'] },
        ],
      },
      {
        task: 'Create a table reservation system with date/time picker and party size',
        subTasks: [
          { id: 'role', label: 'Define the role', keywords: ['you are', 'act as', 'developer'] },
          { id: 'reservation', label: 'Address table reservation logic', keywords: ['reserve', 'reservation', 'table', 'book', 'booking'] },
          { id: 'datetime', label: 'Include date/time selection', keywords: ['date', 'time', 'picker', 'calendar', 'slot'] },
          { id: 'party', label: 'Mention party size/guests', keywords: ['party', 'guests', 'people', 'size', 'capacity'] },
          { id: 'output', label: 'Define output format', keywords: ['html', 'react', 'form', 'component', 'code'] },
        ],
      },
      {
        task: 'Design a loyalty program dashboard showing points, rewards, and order history',
        subTasks: [
          { id: 'role', label: 'Define the role', keywords: ['you are', 'act as', 'developer'] },
          { id: 'loyalty', label: 'Mention loyalty/points system', keywords: ['loyalty', 'points', 'reward', 'earn', 'redeem'] },
          { id: 'history', label: 'Include order history section', keywords: ['history', 'order', 'past', 'previous', 'transaction'] },
          { id: 'dashboard', label: 'Specify dashboard layout', keywords: ['dashboard', 'panel', 'overview', 'stats', 'card'] },
          { id: 'output', label: 'Define output format', keywords: ['html', 'react', 'component', 'page', 'code'] },
        ],
      },
    ],
  },
  {
    id: 'ecommerce',
    category: 'E-Commerce',
    title: 'E-Commerce Store',
    description: 'Build a full-featured online shopping platform',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
    color: 'text-purple-400',
    gradient: 'from-purple-500 to-pink-500',
    taskType: 'Coding',
    tasks: [
      {
        task: 'Build a product listing page with search, filters, and infinite scroll',
        subTasks: [
          { id: 'role', label: 'Define the developer role', keywords: ['you are', 'act as', 'developer'] },
          { id: 'listing', label: 'Mention product listing/grid', keywords: ['product', 'listing', 'grid', 'card', 'catalog'] },
          { id: 'search', label: 'Include search functionality', keywords: ['search', 'query', 'filter', 'find'] },
          { id: 'filter', label: 'Specify filter options (price, category)', keywords: ['filter', 'price', 'category', 'sort', 'range'] },
          { id: 'pagination', label: 'Mention infinite scroll or pagination', keywords: ['infinite', 'scroll', 'pagination', 'load more', 'page'] },
          { id: 'output', label: 'Define output format', keywords: ['html', 'react', 'next', 'component', 'code'] },
        ],
      },
      {
        task: 'Create a product detail page with image gallery, reviews, and add-to-cart',
        subTasks: [
          { id: 'role', label: 'Define the role', keywords: ['you are', 'act as', 'developer'] },
          { id: 'gallery', label: 'Include image gallery/zoom', keywords: ['image', 'gallery', 'zoom', 'thumbnail', 'photo'] },
          { id: 'reviews', label: 'Specify reviews/ratings section', keywords: ['review', 'rating', 'star', 'feedback', 'comment'] },
          { id: 'cart', label: 'Include add-to-cart functionality', keywords: ['cart', 'add', 'buy', 'purchase', 'quantity'] },
          { id: 'output', label: 'Define output format', keywords: ['html', 'react', 'component', 'code'] },
        ],
      },
      {
        task: 'Design a checkout flow with address, payment, and order confirmation steps',
        subTasks: [
          { id: 'role', label: 'Define the role', keywords: ['you are', 'act as', 'developer'] },
          { id: 'checkout', label: 'Address multi-step checkout flow', keywords: ['checkout', 'step', 'flow', 'process', 'wizard'] },
          { id: 'address', label: 'Include address/shipping form', keywords: ['address', 'shipping', 'delivery', 'location', 'zip'] },
          { id: 'payment', label: 'Specify payment integration', keywords: ['payment', 'card', 'stripe', 'razorpay', 'upi', 'pay'] },
          { id: 'confirmation', label: 'Mention order confirmation', keywords: ['confirm', 'success', 'order', 'receipt', 'email'] },
          { id: 'output', label: 'Define output format', keywords: ['html', 'react', 'component', 'code'] },
        ],
      },
    ],
  },
  {
    id: 'school',
    category: 'Education',
    title: 'School Management System',
    description: 'Create a comprehensive school portal for students, teachers, and parents',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
    color: 'text-green-400',
    gradient: 'from-green-500 to-teal-500',
    taskType: 'Coding',
    tasks: [
      {
        task: 'Build a student attendance tracking system with daily reports and alerts',
        subTasks: [
          { id: 'role', label: 'Define the developer role', keywords: ['you are', 'act as', 'developer'] },
          { id: 'attendance', label: 'Mention attendance tracking', keywords: ['attendance', 'present', 'absent', 'mark', 'record'] },
          { id: 'report', label: 'Specify report generation', keywords: ['report', 'daily', 'weekly', 'monthly', 'summary'] },
          { id: 'alert', label: 'Include alerts/notifications', keywords: ['alert', 'notify', 'email', 'sms', 'parent', 'threshold'] },
          { id: 'output', label: 'Define output format', keywords: ['html', 'react', 'dashboard', 'component', 'code'] },
        ],
      },
      {
        task: 'Create an online exam portal with timer, MCQs, and instant result display',
        subTasks: [
          { id: 'role', label: 'Define the role', keywords: ['you are', 'act as', 'developer'] },
          { id: 'exam', label: 'Address exam/quiz logic', keywords: ['exam', 'quiz', 'test', 'question', 'mcq'] },
          { id: 'timer', label: 'Include countdown timer', keywords: ['timer', 'countdown', 'time', 'duration', 'limit'] },
          { id: 'result', label: 'Mention instant result/score', keywords: ['result', 'score', 'mark', 'grade', 'answer', 'correct'] },
          { id: 'output', label: 'Define output format', keywords: ['html', 'react', 'component', 'code'] },
        ],
      },
      {
        task: 'Design a timetable generator for classes with teacher assignments',
        subTasks: [
          { id: 'role', label: 'Define the role', keywords: ['you are', 'act as', 'developer'] },
          { id: 'timetable', label: 'Address timetable/schedule layout', keywords: ['timetable', 'schedule', 'period', 'slot', 'class'] },
          { id: 'teacher', label: 'Mention teacher assignment logic', keywords: ['teacher', 'staff', 'assign', 'subject', 'faculty'] },
          { id: 'conflict', label: 'Include conflict detection', keywords: ['conflict', 'overlap', 'clash', 'validate', 'available'] },
          { id: 'output', label: 'Define output format', keywords: ['html', 'react', 'grid', 'table', 'component', 'code'] },
        ],
      },
    ],
  },
  {
    id: 'hotel',
    category: 'Hospitality',
    title: 'Hotel Booking Platform',
    description: 'Build a luxury hotel reservation and management system',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    color: 'text-yellow-400',
    gradient: 'from-yellow-500 to-amber-500',
    taskType: 'Coding',
    tasks: [
      {
        task: 'Build a room search and availability checker with filters and comparison',
        subTasks: [
          { id: 'role', label: 'Define the role', keywords: ['you are', 'act as', 'developer'] },
          { id: 'search', label: 'Include room search/availability', keywords: ['room', 'search', 'available', 'check-in', 'check-out'] },
          { id: 'filter', label: 'Specify filter options', keywords: ['filter', 'price', 'type', 'amenity', 'sort', 'view'] },
          { id: 'compare', label: 'Mention room comparison', keywords: ['compare', 'side by side', 'vs', 'difference'] },
          { id: 'output', label: 'Define output format', keywords: ['html', 'react', 'component', 'code'] },
        ],
      },
      {
        task: 'Create a hotel admin dashboard with booking management and revenue analytics',
        subTasks: [
          { id: 'role', label: 'Define the role', keywords: ['you are', 'act as', 'developer', 'admin'] },
          { id: 'bookings', label: 'Address booking management', keywords: ['booking', 'reservation', 'manage', 'cancel', 'modify'] },
          { id: 'analytics', label: 'Include revenue/analytics charts', keywords: ['revenue', 'analytics', 'chart', 'graph', 'stats', 'kpi'] },
          { id: 'dashboard', label: 'Specify dashboard layout', keywords: ['dashboard', 'panel', 'overview', 'summary'] },
          { id: 'output', label: 'Define output format', keywords: ['html', 'react', 'component', 'code'] },
        ],
      },
    ],
  },
  {
    id: 'bank',
    category: 'FinTech',
    title: 'Banking Dashboard',
    description: 'Design a secure internet banking and financial management portal',
    image: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=800&q=80',
    color: 'text-emerald-400',
    gradient: 'from-emerald-500 to-green-500',
    taskType: 'Coding',
    tasks: [
      {
        task: 'Build an account dashboard with balance, transaction history, and spending analytics',
        subTasks: [
          { id: 'role', label: 'Define the role', keywords: ['you are', 'act as', 'developer', 'fintech'] },
          { id: 'balance', label: 'Show account balance display', keywords: ['balance', 'account', 'funds', 'amount'] },
          { id: 'transactions', label: 'Include transaction history', keywords: ['transaction', 'history', 'transfer', 'debit', 'credit'] },
          { id: 'analytics', label: 'Mention spending analytics/charts', keywords: ['analytics', 'chart', 'spending', 'category', 'graph'] },
          { id: 'security', label: 'Address security requirements', keywords: ['secure', 'auth', 'encrypt', 'mask', 'otp', '2fa'] },
          { id: 'output', label: 'Define output format', keywords: ['html', 'react', 'component', 'dashboard', 'code'] },
        ],
      },
      {
        task: 'Create a fund transfer flow with beneficiary management and OTP verification',
        subTasks: [
          { id: 'role', label: 'Define the role', keywords: ['you are', 'act as', 'developer'] },
          { id: 'transfer', label: 'Address fund transfer logic', keywords: ['transfer', 'send', 'neft', 'imps', 'rtgs', 'upi'] },
          { id: 'beneficiary', label: 'Include beneficiary management', keywords: ['beneficiary', 'recipient', 'payee', 'account', 'ifsc'] },
          { id: 'otp', label: 'Specify OTP/2FA verification', keywords: ['otp', 'verify', '2fa', 'confirm', 'code', 'secure'] },
          { id: 'output', label: 'Define output format', keywords: ['html', 'react', 'form', 'component', 'code'] },
        ],
      },
    ],
  },
  {
    id: 'realestate',
    category: 'Real Estate',
    title: 'Property Listing Platform',
    description: 'Build a real estate search and property management portal',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
    color: 'text-rose-400',
    gradient: 'from-rose-500 to-pink-500',
    taskType: 'Coding',
    tasks: [
      {
        task: 'Create a property search page with map integration and advanced filters',
        subTasks: [
          { id: 'role', label: 'Define the role', keywords: ['you are', 'act as', 'developer'] },
          { id: 'search', label: 'Include property search', keywords: ['property', 'search', 'listing', 'find', 'location'] },
          { id: 'map', label: 'Mention map integration', keywords: ['map', 'google maps', 'mapbox', 'location', 'geo', 'pin'] },
          { id: 'filter', label: 'Specify filter options', keywords: ['filter', 'price', 'bhk', 'bedroom', 'area', 'type'] },
          { id: 'output', label: 'Define output format', keywords: ['html', 'react', 'component', 'code'] },
        ],
      },
      {
        task: 'Design a property comparison tool with side-by-side feature analysis',
        subTasks: [
          { id: 'role', label: 'Define the role', keywords: ['you are', 'act as', 'developer'] },
          { id: 'compare', label: 'Address comparison functionality', keywords: ['compare', 'comparison', 'side by side', 'vs'] },
          { id: 'features', label: 'List property features to compare', keywords: ['feature', 'amenity', 'price', 'area', 'floor', 'bedroom'] },
          { id: 'visual', label: 'Mention visual diff/highlight', keywords: ['highlight', 'diff', 'visual', 'table', 'chart'] },
          { id: 'output', label: 'Define output format', keywords: ['html', 'react', 'component', 'code'] },
        ],
      },
    ],
  },
  {
    id: 'fitness',
    category: 'Health & Fitness',
    title: 'Gym & Fitness Platform',
    description: 'Build a fitness tracking and gym management system',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    color: 'text-red-400',
    gradient: 'from-red-500 to-orange-500',
    taskType: 'Coding',
    tasks: [
      {
        task: 'Build a workout plan generator with exercise database and progress tracking',
        subTasks: [
          { id: 'role', label: 'Define the role', keywords: ['you are', 'act as', 'developer', 'fitness'] },
          { id: 'workout', label: 'Address workout plan logic', keywords: ['workout', 'exercise', 'plan', 'routine', 'set', 'rep'] },
          { id: 'database', label: 'Mention exercise database/library', keywords: ['database', 'library', 'exercise', 'movement', 'muscle'] },
          { id: 'progress', label: 'Include progress tracking', keywords: ['progress', 'track', 'log', 'history', 'chart', 'weight'] },
          { id: 'output', label: 'Define output format', keywords: ['html', 'react', 'component', 'code'] },
        ],
      },
      {
        task: 'Create a class booking system with trainer profiles and schedule calendar',
        subTasks: [
          { id: 'role', label: 'Define the role', keywords: ['you are', 'act as', 'developer'] },
          { id: 'booking', label: 'Address class booking logic', keywords: ['book', 'class', 'slot', 'reserve', 'enroll'] },
          { id: 'trainer', label: 'Include trainer profiles', keywords: ['trainer', 'coach', 'instructor', 'profile', 'bio'] },
          { id: 'calendar', label: 'Specify schedule/calendar view', keywords: ['calendar', 'schedule', 'week', 'timetable', 'time'] },
          { id: 'output', label: 'Define output format', keywords: ['html', 'react', 'component', 'code'] },
        ],
      },
    ],
  },
];

// â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomChallenge(): { challenge: Challenge; taskIdx: number } {
  const challenge = pickRandom(CHALLENGES);
  const taskIdx = Math.floor(Math.random() * challenge.tasks.length);
  return { challenge, taskIdx };
}

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
  clarity: number; specificity: number; context: number;
  taskDefinition: number; outputDefinition: number; reliability: number;
  security: number; costEfficiency: number; maintainability: number;
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
  structureComponents: { role: boolean; context: boolean; task: boolean; constraints: boolean; examples: boolean; outputFormat: boolean; validation: boolean };
  challengeCoverage?: { id: string; label: string; covered: boolean }[];
  challengeScore?: number;
}

// â”€â”€ Analysis Engine â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function scorePrompt(
  prompt: string,
  taskType: TaskType,
  subTasks?: SubTask[],
): PromptAnalysis {
  const words = prompt.trim().split(/\s+/).filter(Boolean);
  const wc = words.length;
  const p = prompt.toLowerCase();

  const hasRole  = /\b(you are|act as|role:|as a|as an|you're)\b/.test(p);
  const hasCtx   = /\b(context|background|given|following|below|provided|website|platform|system)\b/.test(p);
  const hasTask  = wc > 5;
  const hasCons  = /\b(must|should|avoid|don't|only|limit|ensure|never|always|require)\b/.test(p);
  const hasEx    = /\b(example|e\.g\.|for instance|such as|sample|like)\b/.test(p) || /\b(input:|output:)\b/.test(p);
  const hasOut   = /\b(json|markdown|list|table|format|return|output|structure|schema|xml|csv|html|react|component|page|code)\b/.test(p);
  const hasVal   = /\b(if|when|handle|error|edge case|validate|check|verify|fallback|responsive|mobile)\b/.test(p);

  const dims: Dimensions = {
    clarity:          Math.min(100, 40 + (wc > 10 ? 20 : 0) + (hasRole ? 15 : 0) + (hasTask ? 15 : 0) + (wc > 30 ? 10 : 0)),
    specificity:      Math.min(100, 30 + (hasCons ? 25 : 0) + (hasEx ? 20 : 0) + (wc > 20 ? 15 : 0) + (hasOut ? 10 : 0)),
    context:          Math.min(100, 30 + (hasCtx ? 40 : 0) + (wc > 40 ? 20 : 0) + (hasRole ? 10 : 0)),
    taskDefinition:   Math.min(100, 50 + (hasTask ? 30 : 0) + (wc > 15 ? 20 : 0)),
    outputDefinition: Math.min(100, 20 + (hasOut ? 50 : 0) + (hasEx ? 20 : 0) + (hasVal ? 10 : 0)),
    reliability:      Math.min(100, 30 + (hasVal ? 30 : 0) + (hasCons ? 20 : 0) + (hasEx ? 15 : 0) + (hasOut ? 5 : 0)),
    security:         Math.min(100, 70 + (hasRole ? 10 : 0) + (hasCons ? 10 : 0) + (hasVal ? 10 : 0)),
    costEfficiency:   Math.min(100, 50 + (wc < 200 ? 20 : -10) + (hasOut ? 20 : 0)),
    maintainability:  Math.min(100, 40 + (hasRole ? 15 : 0) + (hasOut ? 20 : 0) + (hasCons ? 15 : 0) + (hasCtx ? 10 : 0)),
  };

  const overall = Math.round(
    dims.clarity * 0.12 + dims.specificity * 0.14 + dims.context * 0.10 +
    dims.taskDefinition * 0.14 + dims.outputDefinition * 0.14 + dims.reliability * 0.12 +
    dims.security * 0.10 + dims.costEfficiency * 0.08 + dims.maintainability * 0.06
  );

  const issues: PromptIssue[] = [];
  if (!hasRole) issues.push({ id: 'role', severity: 'high', category: 'Structure', title: 'No role or persona defined', explanation: 'Without a defined role, the model defaults to generic assistant behavior reducing specialization.', suggestion: 'Add: "You are a senior full-stack developer specializing in healthcare web applications."' });
  if (!hasOut)  issues.push({ id: 'output', severity: 'high', category: 'Output Contract', title: 'Output format not specified', explanation: 'Undefined output format causes inconsistent code responses â€” critical for production systems.', suggestion: 'Specify: "Return complete, production-ready React component code with Tailwind CSS styling."' });
  if (!hasEx)   issues.push({ id: 'examples', severity: 'medium', category: 'Clarity', title: 'No examples or reference provided', explanation: 'Examples of expected UI/output dramatically improve code accuracy for complex components.', suggestion: 'Add: "The component should look similar to [describe UI] with [specific interaction]."' });
  if (!hasVal)  issues.push({ id: 'validation', severity: 'medium', category: 'Reliability', title: 'No error handling or edge cases', explanation: 'Without error handling requirements, generated code skips validation logic entirely.', suggestion: 'Add: "Include form validation, loading states, error boundaries, and empty state handling."' });
  if (!hasCons) issues.push({ id: 'constraints', severity: 'medium', category: 'Specificity', title: 'No technology or design constraints', explanation: 'Without specifying tech stack or design system, the model may use an incompatible stack.', suggestion: 'Add: "Use React with TypeScript, Tailwind CSS. Follow WCAG 2.1 accessibility standards."' });

  // Challenge sub-task coverage
  let challengeCoverage: { id: string; label: string; covered: boolean }[] | undefined;
  let challengeScore: number | undefined;

  if (subTasks && subTasks.length > 0) {
    challengeCoverage = subTasks.map(st => ({
      id: st.id,
      label: st.label,
      covered: st.keywords.some(kw => p.includes(kw.toLowerCase())),
    }));
    const covered = challengeCoverage.filter(c => c.covered).length;
    challengeScore = Math.round((covered / subTasks.length) * 100);
  }

  const inputTokens = Math.round(wc * 1.3) + 200;
  const outputTokens = 800;
  const total = inputTokens + outputTokens;
  const unitCost = 0.000002;

  let productionReadiness: PromptAnalysis['productionReadiness'] = 'NOT READY';
  const highOrCrit = issues.filter(i => i.severity === 'critical' || i.severity === 'high').length;
  if (overall >= 90 && highOrCrit === 0) productionReadiness = 'PRODUCTION READY';
  else if (overall >= 75 && issues.filter(i => i.severity === 'critical').length === 0) productionReadiness = 'READY FOR STAGING';
  else if (overall >= 55) productionReadiness = 'NEEDS REVIEW';

  return {
    overallScore: overall,
    taskType: taskType === 'Other' ? 'Coding' : taskType,
    taskConfidence: 96,
    dimensions: dims,
    issues,
    tokenEstimate: { input: inputTokens, output: outputTokens, total },
    costEstimate: { perRequest: total * unitCost, per1kRequests: total * unitCost * 1000, monthly: total * unitCost * 10000 },
    productionReadiness,
    structureComponents: { role: hasRole, context: hasCtx, task: hasTask, constraints: hasCons, examples: hasEx, outputFormat: hasOut, validation: hasVal },
    challengeCoverage,
    challengeScore,
  };
}

function buildOptimizedPrompt(original: string, mode: OptimizationMode, analysis: PromptAnalysis, challenge?: Challenge, taskText?: string): string {
  const sc = analysis.structureComponents;
  const parts: string[] = [];

  if (!sc.role && challenge) {
    const roleMap: Record<string, string> = {
      hospital: 'You are a senior full-stack developer specializing in healthcare web applications.',
      restaurant: 'You are a senior front-end developer with expertise in food & beverage platforms.',
      ecommerce: 'You are a senior e-commerce developer with deep experience in React and Next.js.',
      school: 'You are a full-stack developer specializing in educational management systems.',
      hotel: 'You are a senior developer with expertise in hospitality and booking systems.',
      bank: 'You are a senior fintech developer specializing in secure banking interfaces.',
      realestate: 'You are a senior developer specializing in real estate platforms and map integrations.',
      fitness: 'You are a full-stack developer specializing in health and fitness applications.',
    };
    parts.push(roleMap[challenge.id] || 'You are a senior full-stack developer.');
  }

  if (taskText) parts.push(`\n**Task:**\n${taskText}`);

  if (!sc.outputFormat && mode !== 'cost') parts.push('\n**Output Requirements:**\nReturn complete, production-ready code with:\n- Full component structure\n- Proper TypeScript types\n- Tailwind CSS styling\n- Responsive layout (mobile-first)');

  if (!sc.constraints) parts.push(
    mode === 'cost'
      ? '\n**Constraints:** Be concise. Return only the essential component code.'
      : '\n**Constraints:**\n- Use React with TypeScript\n- Style with Tailwind CSS\n- Follow WCAG 2.1 accessibility standards\n- Include loading and error states\n- No placeholder comments â€” write complete, working code'
  );

  if (!sc.validation && mode !== 'speed') parts.push('\n**Error Handling:** Include form validation, empty states, loading spinners, and error boundaries.');

  if (parts.length === 0) return original.trim();
  return parts.join('\n\n') + (original.trim() ? '\n\n---\n\n**Additional Notes:**\n' + original.trim() : '');
}

// â”€â”€ Sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 90 ? 'from-emerald-500 to-green-400' : score >= 80 ? 'from-blue-500 to-indigo-500' : score >= 70 ? 'from-yellow-500 to-amber-400' : score >= 50 ? 'from-orange-500 to-red-400' : 'from-red-600 to-rose-700';
  const label = score >= 90 ? 'Excellent' : score >= 80 ? 'Production Ready' : score >= 70 ? 'Needs Improvement' : score >= 50 ? 'Weak' : 'Poor';
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
      <div className="flex justify-between text-xs"><span className="text-slate-400">{label}</span><span className="font-bold text-white">{value}</span></div>
      <div className="h-1.5 rounded-full bg-slate-700/60">
        <motion.div className={`h-full rounded-full ${color}`} initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} />
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

const readinessCfg = {
  'NOT READY':         { color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30'     },
  'NEEDS REVIEW':      { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30'  },
  'READY FOR STAGING': { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30'  },
  'PRODUCTION READY':  { color: 'text-emerald-400',bg: 'bg-emerald-500/10',border: 'border-emerald-500/30' },
};

const OPT_MODES: { key: OptimizationMode; label: string; icon: typeof Sparkles; desc: string }[] = [
  { key: 'quality',     label: 'Quality',    icon: Sparkles,   desc: 'Max response quality'         },
  { key: 'cost',        label: 'Cost',        icon: DollarSign, desc: 'Minimize token cost'          },
  { key: 'speed',       label: 'Speed',       icon: Zap,        desc: 'Low-latency optimized'        },
  { key: 'balanced',    label: 'Balanced',    icon: Settings,   desc: 'Quality + cost + speed'       },
  { key: 'reliability', label: 'Reliability', icon: Shield,     desc: 'Consistent outputs'           },
  { key: 'security',    label: 'Security',    icon: Lock,       desc: 'Injection resistance + safety' },
];

// â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function PromptIQPage() {
  const { status } = useSession();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme !== 'parchment';

  const [{ challenge, taskIdx }, setCurrentChallenge] = useState(() => getRandomChallenge());
  const [imageError, setImageError] = useState(false);

  const currentTask = challenge.tasks[taskIdx];

  const [prompt,       setPrompt]       = useState('');
  const [analysis,     setAnalysis]     = useState<PromptAnalysis | null>(null);
  const [optimized,    setOptimized]    = useState('');
  const [optMode,      setOptMode]      = useState<OptimizationMode>('balanced');
  const [analyzing,    setAnalyzing]    = useState(false);
  const [optimizing,   setOptimizing]   = useState(false);
  const [copiedOrig,   setCopiedOrig]   = useState(false);
  const [copiedOpt,    setCopiedOpt]    = useState(false);
  const [tab,          setTab]          = useState<'analysis' | 'optimize' | 'cost'>('analysis');
  const [shuffling,    setShuffling]    = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { if (status === 'unauthenticated') router.push('/'); }, [status, router]);

  // Debounced live analysis
  useEffect(() => {
    if (!prompt.trim()) { setAnalysis(null); return; }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setAnalysis(scorePrompt(prompt, 'Coding', currentTask.subTasks));
    }, 650);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [prompt, currentTask]);

  const handleShuffle = useCallback(() => {
    setShuffling(true);
    setImageError(false);
    setTimeout(() => {
      setCurrentChallenge(getRandomChallenge());
      setPrompt('');
      setAnalysis(null);
      setOptimized('');
      setShuffling(false);
    }, 400);
  }, []);

  const handleAnalyze = useCallback(() => {
    if (!prompt.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      setAnalysis(scorePrompt(prompt, 'Coding', currentTask.subTasks));
      setAnalyzing(false);
    }, 750);
  }, [prompt, currentTask]);

  const handleOptimize = useCallback(() => {
    if (!analysis) return;
    setOptimizing(true);
    setTimeout(() => {
      setOptimized(buildOptimizedPrompt(prompt, optMode, analysis, challenge, currentTask.task));
      setOptimizing(false);
      setTab('optimize');
    }, 1100);
  }, [prompt, optMode, analysis, challenge, currentTask]);

  const copy = useCallback((text: string, kind: 'orig' | 'opt') => {
    navigator.clipboard.writeText(text).then(() => {
      if (kind === 'orig') { setCopiedOrig(true); setTimeout(() => setCopiedOrig(false), 2000); }
      else                  { setCopiedOpt(true);  setTimeout(() => setCopiedOpt(false),  2000); }
    });
  }, []);

  const optScore = optimized && analysis ? Math.min(100, analysis.overallScore + 14) : null;
  const wordCount = prompt.trim().split(/\s+/).filter(Boolean).length;

  const panel = `rounded-2xl border ${dark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'} p-4`;
  const labelCls = `text-[10px] font-bold uppercase tracking-widest mb-3 block ${dark ? 'text-slate-500' : 'text-slate-400'}`;

  return (
    <div className={`min-h-screen ${dark ? 'bg-[#080810]' : 'bg-slate-50'} pb-20`}>

      {/* â”€â”€ Header â”€â”€ */}
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">

        {/* â•â• LEFT COLUMN â•â• */}
        <div className="space-y-4">

          {/* â”€â”€ Challenge Card â”€â”€ */}
          <motion.div
            key={challenge.id + taskIdx}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: shuffling ? 0 : 1, y: shuffling ? -8 : 0 }}
            transition={{ duration: 0.3 }}
            className={`rounded-2xl border ${dark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'} overflow-hidden`}
          >
            {/* Website image */}
            <div className="relative h-40 w-full bg-slate-800 overflow-hidden">
              {!imageError ? (
                <img
                  src={challenge.image}
                  alt={challenge.title}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${challenge.gradient} opacity-20`}>
                  <ImageIcon size={40} className="text-white/40" />
                </div>
              )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
              {/* Category badge */}
              <div className="absolute top-3 left-3">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r ${challenge.gradient} text-white shadow-lg`}>
                  {challenge.category}
                </span>
              </div>
              {/* Shuffle button */}
              <button
                onClick={handleShuffle}
                disabled={shuffling}
                className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold hover:bg-black/60 transition-colors"
              >
                <Shuffle size={11} className={shuffling ? 'animate-spin' : ''} />
                New Challenge
              </button>
              {/* Title on image */}
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-xs text-slate-400 mb-0.5">{challenge.title}</p>
              </div>
            </div>

            {/* Task */}
            <div className="p-4 space-y-3">
              <div>
                <span className={labelCls}>Your Coding Challenge</span>
                <p className={`text-sm font-bold leading-snug ${dark ? 'text-white' : 'text-slate-900'}`}>
                  {currentTask.task}
                </p>
              </div>

              {/* Sub-tasks checklist */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ListChecks size={13} className="text-violet-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Your prompt should cover ({currentTask.subTasks.length} requirements)
                  </span>
                </div>
                <div className="space-y-1.5">
                  {currentTask.subTasks.map(st => {
                    const covered = analysis?.challengeCoverage?.find(c => c.id === st.id)?.covered;
                    return (
                      <div key={st.id} className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                          covered == null
                            ? 'border border-slate-700 bg-slate-800'
                            : covered
                              ? 'bg-emerald-500/20 border border-emerald-500/40'
                              : 'bg-slate-800 border border-slate-700'
                        }`}>
                          {covered && <Check size={9} className="text-emerald-400" />}
                        </div>
                        <span className={`text-xs leading-tight transition-colors ${
                          covered == null ? 'text-slate-500' : covered ? 'text-slate-300' : 'text-slate-600'
                        }`}>{st.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Challenge score */}
              {analysis?.challengeScore != null && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl border ${
                    analysis.challengeScore >= 80
                      ? 'border-emerald-500/30 bg-emerald-500/10'
                      : analysis.challengeScore >= 50
                        ? 'border-yellow-500/30 bg-yellow-500/10'
                        : 'border-red-500/30 bg-red-500/10'
                  }`}
                >
                  <Target size={14} className={analysis.challengeScore >= 80 ? 'text-emerald-400' : analysis.challengeScore >= 50 ? 'text-yellow-400' : 'text-red-400'} />
                  <div>
                    <p className="text-[10px] text-slate-500">Task Coverage Score</p>
                    <p className={`text-sm font-bold ${analysis.challengeScore >= 80 ? 'text-emerald-400' : analysis.challengeScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {analysis.challengeScore}% â€” {
                        analysis.challengeScore >= 80 ? 'Great coverage!' :
                        analysis.challengeScore >= 50 ? 'Partially covered' :
                        'Missing key requirements'
                      }
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* â”€â”€ Editor â”€â”€ */}
          <div className={`rounded-2xl border ${dark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'} overflow-hidden`}>
            <div className={`flex items-center justify-between px-4 py-2 border-b ${dark ? 'border-slate-800' : 'border-slate-200'}`}>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Your Prompt</span>
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

            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder={`Write a prompt that instructs an AI to complete this challenge:\n\n"${currentTask.task}"\n\nTip: Include your role, tech stack, output format, and edge cases for a higher score.`}
              className={`w-full h-52 p-4 text-sm resize-none outline-none font-mono leading-relaxed ${
                dark ? 'bg-slate-900 text-slate-200 placeholder-slate-700' : 'bg-white text-slate-800 placeholder-slate-300'
              }`}
            />

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
                    ? <><span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Analyzingâ€¦</>
                    : <><Brain size={12} /> Analyze</>}
                </Button>
              </div>
            </div>
          </div>

          {/* â”€â”€ Optimization block â”€â”€ */}
          <AnimatePresence>
            {analysis && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`${panel} space-y-3`}>
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
                    ? <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Optimizingâ€¦</>
                    : <><Sparkles size={15} /> Optimize Prompt <ArrowRight size={13} /></>}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* â•â• RIGHT COLUMN â•â• */}
        <div>
          {/* Empty state */}
          {!analysis && (
            <div className={`${panel} h-72 flex flex-col items-center justify-center gap-4 text-center`}>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/20 flex items-center justify-center">
                <Brain size={26} className="text-violet-400" />
              </div>
              <div>
                <p className={`text-base font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>Write your prompt for the challenge</p>
                <p className={`text-xs mt-1 max-w-xs mx-auto leading-relaxed ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                  PromptIQ will evaluate how well your prompt addresses the coding challenge requirements.
                </p>
              </div>
            </div>
          )}

          {analysis && (
            <motion.div key="panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">

              {/* Tabs */}
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

              {/* â”€â”€ Analysis â”€â”€ */}
              {tab === 'analysis' && (
                <motion.div key="a" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

                  {/* Score */}
                  <div className={panel}>
                    <div className="flex items-center gap-4">
                      <ScoreBadge score={analysis.overallScore} />
                      <div className="flex-1 space-y-2.5">
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${dark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                          <Code2 size={13} className="text-violet-400 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-[10px] text-slate-500">Task Type</p>
                            <p className={`text-sm font-bold leading-tight ${dark ? 'text-white' : 'text-slate-900'}`}>{analysis.taskType}</p>
                          </div>
                          <span className="ml-auto text-xs font-bold text-violet-400 flex-shrink-0">{analysis.taskConfidence}%</span>
                        </div>
                        <div className={`px-3 py-2 rounded-xl border ${readinessCfg[analysis.productionReadiness].bg} ${readinessCfg[analysis.productionReadiness].border}`}>
                          <p className="text-[10px] text-slate-500">Production Readiness</p>
                          <p className={`text-xs font-bold leading-tight ${readinessCfg[analysis.productionReadiness].color}`}>{analysis.productionReadiness}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Challenge coverage */}
                  {analysis.challengeCoverage && (
                    <div className={panel + ' space-y-2'}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={labelCls.replace('mb-3','mb-0')}>Challenge Requirements Coverage</span>
                        <span className={`text-xs font-bold ${analysis.challengeScore! >= 80 ? 'text-emerald-400' : analysis.challengeScore! >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {analysis.challengeCoverage.filter(c => c.covered).length}/{analysis.challengeCoverage.length}
                        </span>
                      </div>
                      {/* Coverage bar */}
                      <div className="h-2 rounded-full bg-slate-700/60 mb-3">
                        <motion.div
                          className={`h-full rounded-full ${analysis.challengeScore! >= 80 ? 'bg-emerald-500' : analysis.challengeScore! >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${analysis.challengeScore}%` }}
                          transition={{ duration: 0.7, ease: 'easeOut' }}
                        />
                      </div>
                      {analysis.challengeCoverage.map(c => (
                        <div key={c.id} className="flex items-center gap-2.5">
                          {c.covered
                            ? <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
                            : <AlertCircle  size={13} className="text-slate-600   flex-shrink-0" />}
                          <span className={`text-xs leading-tight ${c.covered ? 'text-slate-300' : 'text-slate-600'}`}>{c.label}</span>
                          <span className={`ml-auto text-[10px] font-bold flex-shrink-0 ${c.covered ? 'text-emerald-400' : 'text-slate-700'}`}>
                            {c.covered ? 'âœ“ Covered' : 'âœ— Missing'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

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
                </motion.div>
              )}

              {/* â”€â”€ Optimize â”€â”€ */}
              {tab === 'optimize' && (
                <motion.div key="o" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  {!optimized ? (
                    <div className={`${panel} h-56 flex flex-col items-center justify-center gap-3 text-center`}>
                      <Sparkles size={28} className="text-violet-400 opacity-60" />
                      <p className={`text-sm font-semibold ${dark ? 'text-white' : 'text-slate-800'}`}>No optimized version yet</p>
                      <p className="text-xs text-slate-500">Click <strong className="text-violet-400">Optimize Prompt</strong> to generate a challenge-specific improved version</p>
                    </div>
                  ) : (
                    <>
                      <div className={panel}>
                        <div className="flex items-center justify-around">
                          <div className="text-center"><div className="text-3xl font-black text-slate-500">{analysis.overallScore}</div><div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Original</div></div>
                          <ArrowRight size={18} className="text-violet-500" />
                          <div className="text-center"><div className="text-3xl font-black text-emerald-400">{optScore}</div><div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Optimized</div></div>
                          <div className="text-center"><div className="text-xl font-black text-emerald-400">+{optScore! - analysis.overallScore}</div><div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Improvement</div></div>
                        </div>
                      </div>
                      <div className={`rounded-2xl border ${dark ? 'border-violet-500/25 bg-slate-900' : 'border-violet-300/60 bg-violet-50/30'} overflow-hidden`}>
                        <div className={`flex items-center justify-between px-4 py-2 border-b ${dark ? 'border-violet-500/15' : 'border-violet-200'}`}>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400">Optimized Prompt</span>
                          <button onClick={() => copy(optimized, 'opt')} className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors">
                            {copiedOpt ? <Check size={11} /> : <Copy size={11} />}
                            {copiedOpt ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                        <pre className={`p-4 text-xs font-mono leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto ${dark ? 'text-slate-300' : 'text-slate-700'}`}>{optimized}</pre>
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {/* â”€â”€ Cost â”€â”€ */}
              {tab === 'cost' && (
                <motion.div key="c" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
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
                  <div className={`rounded-xl border ${dark ? 'border-amber-500/20 bg-amber-500/5' : 'border-amber-200 bg-amber-50'} p-3`}>
                    <div className="flex gap-2.5">
                      <DollarSign size={13} className="text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-amber-400">Coding tasks generate longer outputs</p>
                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                          Switch to <strong className="text-amber-400">Cost First</strong> mode to generate concise component skeletons instead of full implementations.
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

