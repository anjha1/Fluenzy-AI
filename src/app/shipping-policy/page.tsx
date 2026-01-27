import React from 'react';
import type { Metadata } from 'next';
import PolicyLayout from '@/components/PolicyLayout';

export const metadata: Metadata = {
  title: 'Shipping Policy - Fluenzy AI',
  description: 'Read Fluenzy AI\'s shipping policy for our AI-powered interview preparation and communication training platform.',
  keywords: 'shipping policy, delivery policy, Fluenzy AI, service delivery, terms of service',
  openGraph: {
    title: 'Shipping Policy - Fluenzy AI',
    description: 'Read Fluenzy AI\'s shipping policy for our AI-powered interview preparation platform.',
    type: 'website',
  },
};

const ShippingPolicyPage: React.FC = () => {
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
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Shipping Policy
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Information about our service delivery and digital product access.
          </p>
        </div>

        {/* Last Updated */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Last updated: January 27, 2025</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Digital Service Delivery</h2>
            <p className="text-muted-foreground">
              Fluenzy AI provides digital services and AI-powered training platforms. As our services are delivered
              electronically, there are no physical shipping requirements. Access to our platform is granted immediately
              upon successful payment and account activation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Service Activation</h2>
            <p className="text-muted-foreground mb-4">
              Upon successful payment, your account will be activated within:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Instant activation for most subscription plans</li>
              <li>Within 24 hours for enterprise or custom plans</li>
              <li>Email confirmation sent upon successful activation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Access Requirements</h2>
            <p className="text-muted-foreground mb-4">
              To access our services, you will need:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>A valid email address for account creation</li>
              <li>Internet connection for accessing the platform</li>
              <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
              <li>Microphone access for voice-based training modules</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Technical Support</h2>
            <p className="text-muted-foreground">
              If you experience any technical difficulties accessing your account after activation, please contact our
              support team at <a href="mailto:support@fluenzyai.app" className="text-primary hover:text-primary/80">support@fluenzyai.app</a>.
              We will assist you in resolving any access issues promptly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Information</h2>
            <p className="text-muted-foreground">
              For any questions regarding our shipping policy or service delivery, please reach out to our team:
            </p>
            <div className="mt-4 p-4 bg-muted/10 rounded-lg">
              <p className="text-muted-foreground">
                <strong>Email:</strong> support@fluenzyai.app<br />
                <strong>Response Time:</strong> Within 24 hours
              </p>
            </div>
          </section>
        </div>
      </div>
    </PolicyLayout>
  );
};

export default ShippingPolicyPage;