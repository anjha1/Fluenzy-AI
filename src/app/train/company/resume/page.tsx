import { Metadata } from 'next';
import ResumePageClient from './ResumePageClient';

export const metadata: Metadata = {
  title: 'Upload / Paste Resume | Fluenzy AI',
  description: 'Upload your resume or paste resume text to personalize your AI company-specific interview.',
};

export default function ResumePage() {
  return <ResumePageClient />;
}
