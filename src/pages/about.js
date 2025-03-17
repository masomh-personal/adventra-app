export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <h1 className="text-3xl font-heading mb-4">About Adventra</h1>

      <p className="text-lg font-body leading-relaxed mb-4">
        At <strong>Adventra</strong>, we believe the best memories are made outside — on trails,
        mountain tops, rivers, and campfires. Adventra is a social platform built exclusively for
        outdoor adventurers to connect, explore, and share real-world experiences.
      </p>

      <h2 className="text-2xl font-heading mt-6 mb-2">Our Mission</h2>
      <p className="text-lg font-body leading-relaxed mb-4">
        Our mission is simple: to make outdoor adventures more <strong>accessible</strong>, more
        <strong> social</strong>, and more <strong>memorable</strong>. Whether you're hiking your
        first trail or you're a seasoned backpacker, we want you to find the right people to share
        the journey.
      </p>

      <h2 className="text-2xl font-heading mt-6 mb-2">Why Adventra?</h2>
      <ul className="list-disc pl-6 mb-4 text-lg font-body">
        <li>Connect with adventurers who share your passion for the outdoors.</li>
        <li>Find hiking buddies, plan group trips, or just meet for a quick trail run.</li>
        <li>Discover new locations, share experiences, and build your own adventure story.</li>
      </ul>

      <h2 className="text-2xl font-heading mt-6 mb-2">What Makes Us Different</h2>
      <p className="text-lg font-body leading-relaxed mb-4">
        Unlike traditional social platforms, Adventra is built specifically for the outdoor
        community. From <strong>adventure-based matching</strong> to{' '}
        <strong>geo-located activity feeds</strong>, we focus on bringing people together —
        off-screen and on-trail.
      </p>

      <h2 className="text-2xl font-heading mt-6 mb-2">Our Future Vision</h2>
      <p className="text-lg font-body leading-relaxed mb-8">
        We’re just getting started. In the future, we aim to introduce features like
        <strong> real-time event planning</strong>, <strong>group challenges</strong>, and
        <strong> AI-powered adventure recommendations</strong>. We’re committed to evolving with our
        community, one trail at a time.
      </p>

      {/* FAQ Section */}
      <h2 className="text-2xl font-heading mb-4">Frequently Asked Questions (FAQ)</h2>

      <div className="space-y-6 font-body">
        <div>
          <h3 className="text-xl font-heading mb-1">Is Adventra free to use?</h3>
          <p>
            Yes! Adventra is free to join and use. Optional premium features may be introduced in
            the future for enhanced experiences.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-heading mb-1">How do I find adventure partners?</h3>
          <p>
            After creating a profile, you can explore potential matches based on your adventure
            preferences and connect through our swipe-to-match system.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-heading mb-1">What kind of adventures are supported?</h3>
          <p>
            Adventra supports a wide range of outdoor activities including hiking, backpacking,
            kayaking, rock climbing, skiing, and more. You can customize your preferences in your
            profile.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-heading mb-1">Is my data safe?</h3>
          <p>
            Yes. We take your privacy seriously. Data is encrypted and secured. Please refer to our{' '}
            <a href="/privacy-policy" className="text-primary hover:underline">
              Privacy Policy
            </a>{' '}
            for details.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-heading mb-1">How can I contact support?</h3>
          <p>
            You can reach our team anytime at{' '}
            <a href="mailto:support@adventra.com" className="text-primary hover:underline">
              support@adventra.com
            </a>
            . We’re here to help!
          </p>
        </div>
      </div>
    </div>
  );
}
