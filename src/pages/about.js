import { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';

export default function AboutPage() {
  const faqs = useMemo(
    () => [
      {
        id: uuidv4(),
        question: 'Is Adventra free to use?',
        answer:
          'Yes! Adventra is free to join and use. Optional premium features may be introduced for enhanced experiences.',
      },
      {
        id: uuidv4(),
        question: 'How do I find adventure partners?',
        answer:
          'After creating a profile, explore matches based on your adventure preferences and connect through our swipe-to-match system.',
      },
      {
        id: uuidv4(),
        question: 'What kind of adventures are supported?',
        answer:
          'Adventra supports hiking, backpacking, kayaking, climbing, skiing, and more. Customize your profile for your interests.',
      },
      {
        id: uuidv4(),
        question: 'Is my data safe?',
        answer: (
          <>
            Yes. We take your privacy seriously. Data is encrypted and secured. See our{' '}
            <Link href="/privacy-policy/" className="text-primary hover:underline">
              Privacy Policy
            </Link>{' '}
            for details.
          </>
        ),
      },
      {
        id: uuidv4(),
        question: 'How can I contact support?',
        answer: (
          <>
            Reach us anytime at {/* mailto: link correctly uses <a> */}
            <a href="mailto:support@adventra.com" className="text-primary hover:underline">
              support@adventra.com
            </a>
            . We&rsquo;re here to help!
          </>
        ),
      },
    ],
    []
  );

  const [openFAQs, setOpenFAQs] = useState(new Set());

  const toggleFAQ = (id) => {
    setOpenFAQs((prev) => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return updated;
    });
  };

  return (
    <div className="w-full flex-grow bg-background text-foreground flex items-center justify-center p-6 font-body">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-8 my-8">
        <h1 className="text-3xl font-heading text-primary text-center mb-2">About Adventra</h1>
        <hr className="border-t border-gray-300 mb-6" />

        <p className="text-lg leading-relaxed mb-4">
          At <strong>Adventra</strong>, we believe the best memories are made outside — on trails,
          mountain tops, rivers, and around campfires. Adventra is a social platform built
          exclusively for outdoor adventurers to connect, explore, and share real-world experiences.
        </p>

        <h2 className="text-2xl font-heading text-secondary mt-6 mb-2">Our Mission</h2>
        <p className="text-lg leading-relaxed mb-4">
          Our mission is simple: to make outdoor adventures more <strong>accessible</strong>, more{' '}
          <strong>social</strong>, and more <strong>memorable</strong>. Whether you&rsquo;re hiking
          your first trail or you&rsquo;re a seasoned backpacker, we help you find the right people
          to share the journey.
        </p>

        <h2 className="text-2xl font-heading text-secondary mt-6 mb-2">Why Adventra?</h2>
        <ul className="list-disc pl-6 mb-4 text-lg">
          <li>Connect with adventurers who share your passion for the outdoors.</li>
          <li>Find hiking buddies, plan group trips, or meet for a quick trail run.</li>
          <li>Discover new locations, share experiences, and build your adventure story.</li>
        </ul>

        <h2 className="text-2xl font-heading text-secondary mt-6 mb-2">What Makes Us Different</h2>
        <p className="text-lg leading-relaxed mb-4">
          Unlike traditional platforms, Adventra is built specifically for the outdoor community.
          From <strong>adventure-based matching</strong> to{' '}
          <strong>geo-located activity feeds</strong>, we bring people together — off-screen and
          on-trail.
        </p>

        <h2 className="text-2xl font-heading text-secondary mt-6 mb-2">Our Future Vision</h2>
        <p className="text-lg leading-relaxed mb-8">
          We&rsquo;re just getting started. In the future, expect features like{' '}
          <strong>real-time event planning</strong>, <strong>group challenges</strong>, and{' '}
          <strong>AI-powered adventure recommendations</strong>. We&rsquo;re committed to growing
          with our community, one trail at a time.
        </p>

        <h2 className="text-2xl font-heading text-primary text-center mb-4">
          Frequently Asked Questions (FAQ)
        </h2>

        <div className="space-y-4">
          {faqs.map(({ id, question, answer }) => {
            const isOpen = openFAQs.has(id);
            return (
              <div key={id} className="border border-gray-300 rounded-md">
                <button
                  onClick={() => toggleFAQ(id)}
                  className="w-full text-left px-4 py-3 font-heading text-lg font-semibold flex justify-between items-center focus:outline-none"
                >
                  {question}
                  <span>{isOpen ? '-' : '+'}</span>
                </button>

                <div
                  className={`px-4 overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-96 pb-4' : 'max-h-0'
                  }`}
                >
                  {isOpen && <div className="text-lg leading-relaxed">{answer}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
