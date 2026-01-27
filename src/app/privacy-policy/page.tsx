import React from 'react';
import type { Metadata } from 'next';
import PolicyLayout from '@/components/PolicyLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy - Fluenzy AI',
  description: 'Learn how Fluenzy AI collects, uses, and protects your personal information. Our privacy policy covers data security, user rights, and compliance standards.',
  keywords: 'privacy policy, data protection, Fluenzy AI, user data, privacy rights',
  openGraph: {
    title: 'Privacy Policy - Fluenzy AI',
    description: 'Learn how Fluenzy AI collects, uses, and protects your personal information.',
    type: 'website',
  },
};

const PrivacyPolicyPage: React.FC = () => {
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
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
        </div>

        {/* Last Updated */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Last updated: January 27, 2025</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
            <p className="text-muted-foreground mb-4">
              We collect information to provide and improve our AI-powered interview preparation and communication training services.
            </p>

            <h3 className="text-xl font-medium text-foreground mb-3">Personal Information</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Name and email address</li>
              <li>Account credentials and profile information</li>
              <li>Payment information (processed securely through Stripe)</li>
              <li>Communication preferences</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3">Usage Data</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Training session data and performance metrics</li>
              <li>Interaction logs with our AI systems</li>
              <li>Device and browser information</li>
              <li>Analytics data for service improvement</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Information We Do Not Store</h2>
            <p className="text-muted-foreground mb-4">
              For your security, we adhere to strict data minimization practices:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>We do not store credit card numbers, CVV codes, or full banking details</li>
              <li>All payment processing is handled securely by Stripe</li>
              <li>We do not retain sensitive personal data longer than necessary</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Account Management:</strong> Creating and maintaining your account</li>
              <li><strong>Service Delivery:</strong> Providing AI-powered training and feedback</li>
              <li><strong>AI Improvement:</strong> Training and enhancing our AI models</li>
              <li><strong>Customer Support:</strong> Responding to your inquiries and providing assistance</li>
              <li><strong>Communication:</strong> Sending service updates and important notifications</li>
              <li><strong>Analytics:</strong> Understanding usage patterns to improve our platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Cookies and Tracking</h2>
            <p className="text-muted-foreground mb-4">
              We use cookies and similar technologies to enhance your experience:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Essential Cookies:</strong> Required for platform functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how you use our service</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Third-Party Services</h2>
            <p className="text-muted-foreground mb-4">
              We work with trusted third-party providers:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Stripe:</strong> Payment processing (PCI DSS compliant)</li>
              <li><strong>Hosting Providers:</strong> Secure cloud infrastructure</li>
              <li><strong>Analytics Services:</strong> Usage tracking and performance monitoring</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Data Security</h2>
            <p className="text-muted-foreground mb-4">
              We implement industry-standard security measures:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>End-to-end encryption for data transmission</li>
              <li>Secure data storage with regular backups</li>
              <li>Access controls and authentication requirements</li>
              <li>Regular security audits and updates</li>
              <li>Incident response procedures</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Your Rights and Control</h2>
            <p className="text-muted-foreground mb-4">
              You have the following rights regarding your personal data:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data</li>
              <li><strong>Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Restriction:</strong> Limit how we process your data</li>
              <li><strong>Objection:</strong> Object to certain data processing activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Data Retention</h2>
            <p className="text-muted-foreground">
              We retain your personal data only as long as necessary for the purposes outlined in this policy,
              unless a longer retention period is required by law. Account data is retained while your account
              is active and for a reasonable period thereafter for legal and regulatory compliance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. International Data Transfers</h2>
            <p className="text-muted-foreground">
              Your data may be transferred to and processed in countries other than your own. We ensure
              appropriate safeguards are in place to protect your data during such transfers, including
              standard contractual clauses and adequacy decisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Policy Updates</h2>
            <p className="text-muted-foreground mb-4">
              We may update this privacy policy periodically. We will notify you of any material changes
              through our platform or via email. Your continued use of our services after such changes
              constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this privacy policy or our data practices, please contact us:
            </p>
            <div className="bg-card border border-card-border rounded-lg p-4">
              <p className="text-foreground font-medium">Email: support@fluenzyai.app</p>
              <p className="text-muted-foreground text-sm mt-1">
                We aim to respond to all privacy-related inquiries within 30 days.
              </p>
            </div>
          </section>
        </div>
      </div>
    </PolicyLayout>
  );
};

export default PrivacyPolicyPage;