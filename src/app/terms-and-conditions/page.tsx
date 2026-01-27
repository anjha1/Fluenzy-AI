import React from 'react';
import type { Metadata } from 'next';
import PolicyLayout from '@/components/PolicyLayout';

export const metadata: Metadata = {
  title: 'Terms & Conditions - Fluenzy AI',
  description: 'Read Fluenzy AI\'s terms and conditions for using our AI-powered interview preparation and communication training platform.',
  keywords: 'terms and conditions, Fluenzy AI, user agreement, service terms, legal terms',
  openGraph: {
    title: 'Terms & Conditions - Fluenzy AI',
    description: 'Read Fluenzy AI\'s terms and conditions for using our AI-powered interview preparation platform.',
    type: 'website',
  },
};

const TermsAndConditionsPage: React.FC = () => {
  return (
    <PolicyLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1
            className="text-4xl font-bold"
            style={{
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Terms & Conditions
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Please read these terms carefully before using Fluenzy AI's services.
          </p>
        </div>

        {/* Last Updated */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Last updated: January 27, 2025</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using Fluenzy AI's services, you accept and agree to be bound by the terms and provision
              of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Eligibility</h2>
            <p className="text-muted-foreground mb-4">
              To use our services, you must:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Be at least 18 years old or have parental consent</li>
              <li>Have the legal capacity to enter into binding agreements</li>
              <li>Provide accurate and complete registration information</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Account Responsibility</h2>
            <p className="text-muted-foreground mb-4">
              You are responsible for:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
              <li>Providing accurate and up-to-date information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Subscription Plans</h2>
            <p className="text-muted-foreground mb-4">
              Fluenzy AI offers the following subscription tiers:
            </p>

            <h3 className="text-xl font-medium text-foreground mb-3">Free Plan</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Limited access to basic training modules</li>
              <li>Restricted AI interaction sessions</li>
              <li>Basic performance analytics</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3">Standard Plan</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Full access to all training modules</li>
              <li>Unlimited AI interaction sessions</li>
              <li>Advanced performance analytics and reports</li>
              <li>Email support</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3">Pro Plan</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>All Standard features</li>
              <li>Priority customer support</li>
              <li>Custom training scenarios</li>
              <li>Advanced AI feedback and recommendations</li>
              <li>Progress tracking and detailed insights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Billing and Payments</h2>
            <p className="text-muted-foreground mb-4">
              Payment terms and conditions:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Subscriptions are billed in advance on a monthly or annual basis</li>
              <li>All payments are processed securely through Stripe</li>
              <li>Failed payments may result in service suspension</li>
              <li>Price changes will be communicated 30 days in advance</li>
              <li>All fees are non-refundable except as specified in our refund policy</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Free Trial and Usage Limits</h2>
            <p className="text-muted-foreground mb-4">
              Free access limitations:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Free plan users have limited monthly usage quotas</li>
              <li>Trial periods may be offered at our discretion</li>
              <li>Usage limits are subject to change with notice</li>
              <li>Excess usage may require upgrading to a paid plan</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Fair Usage Policy</h2>
            <p className="text-muted-foreground mb-4">
              To ensure fair access for all users:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Services must be used for legitimate training purposes only</li>
              <li>Automated or excessive usage may be restricted</li>
              <li>Sharing accounts or credentials is prohibited</li>
              <li>Commercial use requires a separate enterprise agreement</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Suspension and Termination</h2>
            <p className="text-muted-foreground mb-4">
              We reserve the right to suspend or terminate accounts for:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Violation of these terms</li>
              <li>Fraudulent or abusive behavior</li>
              <li>Non-payment of fees</li>
              <li>Extended periods of inactivity</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Users may terminate their accounts at any time through account settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Intellectual Property</h2>
            <p className="text-muted-foreground mb-4">
              Intellectual property rights:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Fluenzy AI content and technology are protected by copyright and other laws</li>
              <li>Users retain rights to their own content and data</li>
              <li>AI-generated content may be used for personal training purposes</li>
              <li>Reverse engineering or unauthorized access is prohibited</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              Fluenzy AI's liability is limited to the amount paid for services in the preceding 12 months.
              We are not liable for indirect damages, lost profits, or consequential losses arising from service use.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Governing Law</h2>
            <p className="text-muted-foreground">
              These terms are governed by the laws of India. Any disputes will be resolved through binding arbitration
              in accordance with Indian arbitration law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">12. Updates to Terms</h2>
            <p className="text-muted-foreground">
              We may update these terms periodically. Users will be notified of material changes via email or platform
              notifications. Continued use after changes constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">13. Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              For questions about these terms, please contact us:
            </p>
            <div className="bg-card border border-card-border rounded-lg p-4">
              <p className="text-foreground font-medium">Email: support@fluenzyai.app</p>
              <p className="text-muted-foreground text-sm mt-1">
                Legal inquiries will be responded to within 7 business days.
              </p>
            </div>
          </section>
        </div>
      </div>
    </PolicyLayout>
  );
};

export default TermsAndConditionsPage;