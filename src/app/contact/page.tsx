import React from 'react';
import type { Metadata } from 'next';
import PolicyLayout from '@/components/PolicyLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us - Fluenzy AI',
  description: 'Get in touch with Fluenzy AI. We\'re here to help with your interview preparation and communication training needs.',
  keywords: 'contact Fluenzy AI, support, customer service, AI interview training',
  openGraph: {
    title: 'Contact Us - Fluenzy AI',
    description: 'Get in touch with Fluenzy AI. We\'re here to help with your interview preparation and communication training needs.',
    type: 'website',
  },
};

const ContactPage: React.FC = () => {
  return (
    <PolicyLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions about Fluenzy AI? We're here to help you succeed in your interview preparation journey.
          </p>
        </div>

        {/* Company Info */}
        <Card className="glass border-card-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Fluenzy AI
            </CardTitle>
            <CardDescription>
              AI-powered interview preparation & communication training platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Fluenzy AI is an AI-powered platform designed to help users improve communication skills and prepare for interviews.
            </p>
            <div className="space-y-2">
              <p className="font-medium">Support Email:</p>
              <p className="text-primary">support@fluenzyai.app</p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <ContactForm />
      </div>
    </PolicyLayout>
  );
};

export default ContactPage;