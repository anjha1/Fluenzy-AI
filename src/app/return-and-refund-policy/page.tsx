import React from 'react';
import type { Metadata } from 'next';
import PolicyLayout from '@/components/PolicyLayout';

export const metadata: Metadata = {
  title: 'Return & Refund Policy - Fluenzy AI',
  description: 'Learn about Fluenzy AI\'s refund policy for digital services. Understand eligibility criteria and the refund request process.',
  keywords: 'refund policy, return policy, Fluenzy AI, digital services refund, cancellation policy',
  openGraph: {
    title: 'Return & Refund Policy - Fluenzy AI',
    description: 'Learn about Fluenzy AI\'s refund policy for digital services.',
    type: 'website',
  },
};

const ReturnAndRefundPolicyPage: React.FC = () => {
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
            Return & Refund Policy
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Understanding our refund policy for digital services and subscription cancellations.
          </p>
        </div>

        {/* Last Updated */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Last updated: January 27, 2025</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Digital Services Nature</h2>
            <p className="text-muted-foreground mb-4">
              Fluenzy AI provides digital services that are consumed immediately upon access. Unlike physical products,
              digital services cannot be "returned" in the traditional sense once they have been used.
            </p>
            <div className="bg-card border border-card-border rounded-lg p-6">
              <h3 className="text-xl font-medium text-foreground mb-3">Key Considerations</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Services are delivered instantly after payment</li>
                <li>Digital content is accessible immediately</li>
                <li>AI interactions begin upon account activation</li>
                <li>Training modules are available for immediate use</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">General Refund Policy</h2>
            <p className="text-muted-foreground mb-4">
              Due to the digital nature of our services, refunds are generally not available once services have been accessed and used.
              However, we provide refunds in specific circumstances to ensure customer satisfaction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Refund Eligibility</h2>
            <p className="text-muted-foreground mb-4">
              Refunds may be granted in the following situations:
            </p>

            <h3 className="text-xl font-medium text-foreground mb-3">Technical Issues</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Platform inaccessibility for more than 24 consecutive hours</li>
              <li>Critical bugs preventing core functionality</li>
              <li>Account access issues not resolved within 48 hours</li>
              <li>Technical problems on our end affecting service delivery</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3">Payment Errors</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Duplicate or accidental payments</li>
              <li>Unauthorized charges (with proper verification)</li>
              <li>Payment processing errors by our payment provider</li>
              <li>Subscription charges for cancelled accounts</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3">Service Discrepancies</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Failure to deliver advertised features</li>
              <li>Significant deviation from service description</li>
              <li>Billing errors or incorrect plan assignments</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Non-Refundable Situations</h2>
            <p className="text-muted-foreground mb-4">
              Refunds will not be provided in these cases:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Change of mind after using the service</li>
              <li>Dissatisfaction with learning outcomes</li>
              <li>Incompatible device or browser issues</li>
              <li>Internet connectivity problems</li>
              <li>Completed training sessions or consumed content</li>
              <li>Free trial or promotional usage</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Refund Request Process</h2>
            <p className="text-muted-foreground mb-4">
              To request a refund, follow these steps:
            </p>
            <ol className="list-decimal pl-6 text-muted-foreground space-y-3">
              <li><strong>Contact Support:</strong> Email support@fluenzyai.app with your refund request</li>
              <li><strong>Provide Details:</strong> Include your account email, payment reference, and reason for refund</li>
              <li><strong>Verification:</strong> Our team will verify your eligibility and circumstances</li>
              <li><strong>Decision:</strong> We'll respond within 5-7 business days with our decision</li>
              <li><strong>Processing:</strong> Approved refunds are processed within 5-7 business days</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Refund Timeline</h2>
            <p className="text-muted-foreground mb-4">
              Refund processing times:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Review Period:</strong> 5-7 business days to review and approve refund requests</li>
              <li><strong>Processing Time:</strong> 5-7 business days for refund to appear in your account</li>
              <li><strong>Banking Time:</strong> Additional 3-5 business days depending on your bank</li>
              <li><strong>Total Time:</strong> Up to 15 business days from request to completion</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Refund Method</h2>
            <p className="text-muted-foreground mb-4">
              All refunds are processed through Stripe and returned to the original payment method:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Credit/Debit cards: Refund appears on your statement within 5-7 business days</li>
              <li>Digital wallets: Refund credited to your wallet balance</li>
              <li>Bank transfers: Refund deposited to your linked bank account</li>
              <li>Processing fees may apply depending on your payment method</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Subscription Cancellation</h2>
            <p className="text-muted-foreground mb-4">
              For subscription cancellations:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Cancellations take effect at the end of the current billing period</li>
              <li>No refunds for partial billing periods</li>
              <li>Access continues until the end of the paid period</li>
              <li>Cancellation can be done through account settings</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              For refund requests or questions about this policy:
            </p>
            <div className="bg-card border border-card-border rounded-lg p-4">
              <p className="text-foreground font-medium">Email: support@fluenzyai.app</p>
              <p className="text-muted-foreground text-sm mt-1">
                Include "Refund Request" in the subject line for faster processing.
              </p>
            </div>
          </section>
        </div>
      </div>
    </PolicyLayout>
  );
};

export default ReturnAndRefundPolicyPage;