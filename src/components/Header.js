import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-primary-light shadow-md relative z-10">
      {/* Logo + Text Link to Home */}
      <Link href="/" className="flex items-center space-x-2">
        <img src="/adventra-logo.png" alt="Adventra Logo" className="h-12" />
        <span className="text-white text-2xl font-heading font-semibold lowercase tracking-wide">
          adventra
        </span>
      </Link>

      {/* Navigation Links */}
      <nav className="space-x-6 font-heading font-bold text-white">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <Link href="/about" className="hover:text-primary">
          About
        </Link>
        <Link href="/contact" className="hover:text-primary">
          Contact
        </Link>
        <Link href="/login" className="hover:text-primary">
          Login
        </Link>
      </nav>
    </header>
  );
}
