import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  // Close menu when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMenuOpen(false);
    };

    router.events.on('routeChangeStart', handleRouteChange);

    // Clean up the event listener when component unmounts
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="flex justify-between items-center p-4 bg-primary-light shadow-md relative z-30">
      {/* Logo + Text Link to Home */}
      <Link href="/" className="flex items-center space-x-2">
        <img src="/adventra-logo.png" alt="Adventra Logo" className="h-12" />
        <span className="text-white text-2xl font-heading font-semibold lowercase tracking-wide drop-shadow-md">
          adventra
        </span>
      </Link>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-white p-2"
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
          />
        </svg>
      </button>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-6 font-heading font-bold text-white">
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

      {/* Mobile Navigation Menu (Dropdown) */}
      {isMenuOpen && (
        <div
          className="absolute top-full left-0 right-0 bg-primary-light shadow-md md:hidden z-50"
          data-testid="mobile-menu"
        >
          <nav className="flex flex-col items-center py-4 space-y-4 font-heading font-bold text-white">
            <Link href="/" className="hover:text-primary w-full text-center py-2">
              Home
            </Link>
            <Link href="/about" className="hover:text-primary w-full text-center py-2">
              About
            </Link>
            <Link href="/contact" className="hover:text-primary w-full text-center py-2">
              Contact
            </Link>
            <Link href="/login" className="hover:text-primary w-full text-center py-2">
              Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
