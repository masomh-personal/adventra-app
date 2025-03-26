export default function PrivacyPolicyPage() {
  return (
    <div className="w-full flex-grow bg-background text-foreground flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-8 font-body my-8">
        <h1 className="text-3xl font-heading mb-6 text-primary">Privacy Policy</h1>

        <p className="mb-4 leading-relaxed">
          At <strong>Adventra</strong>, your privacy is important to us. This Privacy Policy
          outlines how we collect, use, and safeguard your personal information when you interact
          with our platform. By using Adventra, you consent to the practices described below.
        </p>

        {/* Section 1 */}
        <h2 className="text-2xl font-heading mt-8 mb-3 text-secondary">
          1. Information We Collect
        </h2>
        <p className="mb-2">We may collect the following types of information:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>
            <strong>Account Information:</strong> Name, email, password (encrypted), and profile
            data.
          </li>
          <li>
            <strong>Adventure Preferences:</strong> Activity types, skill levels, and location.
          </li>
          <li>
            <strong>Media:</strong> Photos or content you upload.
          </li>
          <li>
            <strong>Usage Data:</strong> Device/browser type, IP address, and app interactions.
          </li>
        </ul>

        {/* Section 2 */}
        <h2 className="text-2xl font-heading mt-8 mb-3 text-secondary">
          2. How We Use Your Information
        </h2>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Create and manage your account.</li>
          <li>Personalize your experience and match you with other adventurers.</li>
          <li>Improve platform features and functionality.</li>
          <li>Send updates, promotions, and support (opt-out anytime).</li>
          <li>Ensure the platform's security and integrity.</li>
        </ul>

        {/* Section 3 */}
        <h2 className="text-2xl font-heading mt-8 mb-3 text-secondary">
          3. Data Sharing & Third Parties
        </h2>
        <p className="mb-4">
          We do <strong>not sell</strong> your data. Limited information may be shared with trusted
          third parties (e.g., hosting, analytics) solely to support our core services.
        </p>

        {/* Section 4 */}
        <h2 className="text-2xl font-heading mt-8 mb-3 text-secondary">4. Data Security</h2>
        <p className="mb-4">
          We use industry-standard encryption and security to protect your data. However, no system
          is entirely risk-free, so we recommend using strong passwords and safe online habits.
        </p>

        {/* Section 5 */}
        <h2 className="text-2xl font-heading mt-8 mb-3 text-secondary">5. Your Choices & Rights</h2>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Update or delete your profile anytime.</li>
          <li>Opt-out of marketing emails in settings or unsubscribe links.</li>
          <li>Request data export or permanent deletion.</li>
        </ul>

        {/* Section 6 */}
        <h2 className="text-2xl font-heading mt-8 mb-3 text-secondary">6. Children's Privacy</h2>
        <p className="mb-4">
          Adventra is not intended for users under 18. We do not knowingly collect data from
          children. Contact us if you believe a minor has provided data.
        </p>

        {/* Section 7 */}
        <h2 className="text-2xl font-heading mt-8 mb-3 text-secondary">
          7. Changes to This Policy
        </h2>
        <p className="mb-4">
          We may update this policy as needed. Users will be notified of significant changes via
          email or in-app notifications.
        </p>

        {/* Section 8 */}
        <h2 className="text-2xl font-heading mt-8 mb-3 text-secondary">8. Contact Us</h2>
        <p className="mb-4">
          For questions or concerns, email us at{' '}
          <a href="mailto:privacy@adventra.com" className="text-primary hover:underline">
            privacy@adventra.com
          </a>
          .
        </p>

        <p className="text-sm text-gray-500">
          Last updated:{' '}
          {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
    </div>
  );
}
