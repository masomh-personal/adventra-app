export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6 font-body">
      <h1 className="text-3xl font-heading mb-4">Privacy Policy</h1>

      <p className="mb-4">
        At <strong>Adventra</strong>, your privacy is important to us. This Privacy Policy describes
        how we collect, use, and protect your personal information when you interact with our
        platform. By using Adventra, you agree to the practices described below.
      </p>

      <h2 className="text-2xl font-heading mt-6 mb-2">1. Information We Collect</h2>
      <p className="mb-2">
        We collect both personal and non-personal information to provide you with the best
        experience possible. Information we collect includes:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>
          <strong>Account Information:</strong> Name, email address, password (encrypted), and
          profile details.
        </li>
        <li>
          <strong>Adventure Preferences:</strong> Activity types, skill levels, location
          preferences.
        </li>
        <li>
          <strong>Media:</strong> Photos or media you upload to your profile.
        </li>
        <li>
          <strong>Usage Data:</strong> App interactions, device type, browser type, IP address.
        </li>
      </ul>

      <h2 className="text-2xl font-heading mt-6 mb-2">2. How We Use Your Information</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>To create and manage your Adventra account.</li>
        <li>To personalize your experience and match you with other adventurers.</li>
        <li>To improve our platform and develop new features.</li>
        <li>
          To communicate with you about updates, promotions, and support (you can opt out anytime).
        </li>
        <li>To ensure the security and integrity of our platform.</li>
      </ul>

      <h2 className="text-2xl font-heading mt-6 mb-2">3. Data Sharing & Third Parties</h2>
      <p className="mb-4">
        We do <strong>not sell</strong> your personal information. We may share limited data with
        trusted third-party providers for services like hosting, analytics, and authentication, only
        to support core functionality.
      </p>

      <h2 className="text-2xl font-heading mt-6 mb-2">4. Data Security</h2>
      <p className="mb-4">
        We take data security seriously. We use industry-standard encryption and security measures
        to protect your data from unauthorized access, alteration, or disclosure. However, no system
        is completely immune to risks, so we encourage strong passwords and safe online practices.
      </p>

      <h2 className="text-2xl font-heading mt-6 mb-2">5. Your Choices & Rights</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>You can view, update, or delete your profile at any time.</li>
        <li>
          You can opt out of marketing emails through your account settings or unsubscribe links.
        </li>
        <li>You can request to have your data exported or permanently deleted.</li>
      </ul>

      <h2 className="text-2xl font-heading mt-6 mb-2">6. Children’s Privacy</h2>
      <p className="mb-4">
        Adventra is not intended for children under the age of 13. We do not knowingly collect
        information from individuals under 13. If you are a parent or guardian and believe your
        child has provided us with personal data, please contact us immediately.
      </p>

      <h2 className="text-2xl font-heading mt-6 mb-2">7. Changes to This Policy</h2>
      <p className="mb-4">
        We may update this Privacy Policy to reflect changes in our practices or legal obligations.
        We will notify users of significant updates through email or app notifications.
      </p>

      <h2 className="text-2xl font-heading mt-6 mb-2">8. Contact Us</h2>
      <p>
        Questions or concerns? Contact our team at{' '}
        <a href="mailto:privacy@adventra.com" className="text-primary hover:underline">
          privacy@adventra.com
        </a>
        .
      </p>
    </div>
  );
}
