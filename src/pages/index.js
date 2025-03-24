import Link from 'next/link';
import { useRouter } from 'next/router';
import Button from '@/components/Button';

export default function HomePage() {
  const router = useRouter(); // Initialize router

  return (
    <div className="relative min-h-screen flex items-center justify-center text-white text-center overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover z-[-1]"
      >
        <source src="/media/hiking4.mp4" type="video/mp4" />
      </video>

      {/* Main Content */}
      <section className="z-10 px-4 space-y-4">
        <h2 className="text-6xl font-heading uppercase font-bold">🏕️ Welcome to Adventra</h2>
        <p className="text-lg font-body font-bold">
          A social network for outdoor adventurers. Connect, share, and explore!
        </p>

        <div className="flex flex-col items-center space-y-2 mt-4">
          <Button label="Login" onClick={() => router.push('/login')} />

          <Link href="/signup" className="hover:text-secondary text-lg mt-2 font-body font-bold">
            Don’t have an account? Sign up today!
          </Link>
        </div>
      </section>
    </div>
  );
}
