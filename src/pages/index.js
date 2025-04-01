import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Button from '@/components/Button';
import withAuth from '@/lib/withAuth';

function HomePage() {
  const router = useRouter();
  const [videoError, setVideoError] = useState(false);

  return (
    <div className="w-full flex items-center justify-center text-white text-center relative">
      {/* Background Video with Fallback */}
      {!videoError ? (
        <video
          autoPlay
          loop
          muted
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover z-[-1]"
          onError={() => setVideoError(true)}
        >
          <source src="/media/homepage_hiking_compressed.mp4" type="video/mp4" />
        </video>
      ) : (
        <div
          data-testid="gradient-fallback"
          className="absolute inset-0 bg-gradient-to-r from-green-800 to-blue-900 z-[-1]"
          aria-hidden="true"
        />
      )}

      {/* Dark Overlay for Better Text Readability */}
      <div
        data-testid="dark-overlay"
        className="absolute inset-0 bg-black opacity-40 z-[-1]"
        aria-hidden="true"
      />

      {/* Main Content */}
      <section className="z-10 px-4 py-12 md:py-16 space-y-6 max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-heading uppercase font-bold">
          🏕️ Welcome to Adventra
        </h2>
        <p className="text-base md:text-lg font-body font-bold">
          A social network for outdoor adventurers. Connect, share, and explore!
        </p>

        <div className="flex flex-col items-center space-y-3 mt-6">
          <Button label="Login" onClick={() => router.push('/login')} />

          <Link href="/signup" className="hover:text-secondary text-lg mt-2 font-body font-bold">
            Don't have an account? Sign up today!
          </Link>
        </div>
      </section>
    </div>
  );
}

export default withAuth(HomePage, { redirectIfAuthenticated: true });
