import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import supabase from '@/lib/supabaseClient';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch initial session
    const fetchSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (error) {
        console.error('Error fetching session:', error);
      }
    };

    fetchSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    // Close menu when route changes
    const handleRouteChange = () => {
      setIsMenuOpen(false);
    };

    router.events.on('routeChangeStart', handleRouteChange);

    // Clean up listeners
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  // Logout handler
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error logging out:', error);
        return;
      }

      // Properly await router push
      await router.push('/login');
    } catch (error) {
      console.error('Unexpected logout error:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Navigation Links (Now conditionally created)
  const baseNavLinks = [
    { href: '/about', label: 'About', dataTestId: 'about-link' },
    { href: '/contact', label: 'Contact', dataTestId: 'contact-link' },
  ];

  const loggedInNavLinks = [
    { href: '/dashboard', label: 'Dashboard', dataTestId: 'dashboard-link' },
    ...baseNavLinks,
  ];

  const loggedOutNavLinks = [
    { href: '/', label: 'Home', dataTestId: 'home-link' },
    ...baseNavLinks,
  ];

  const navLinks = user ? loggedInNavLinks : loggedOutNavLinks;

  // Auth Link (Now conditionally created)
  const authLink = user
    ? {
        href: '#',
        label: 'Logout',
        onClick: handleLogout,
        dataTestId: 'logout-button',
      }
    : {
        href: '/login',
        label: 'Login',
        dataTestId: 'login-link',
      };

  return (
    <header className="flex justify-between items-center p-4 bg-primary-light shadow-md relative z-30">
      {/* Logo + Text Link to Home */}
      <Link href="/" className="flex items-center space-x-2" data-testid="logo-link">
        <Image
          src="/adventra-logo.png"
          alt="Adventra Logo"
          width={48} // Set width (adjust if logo isn't square)
          height={48} // Set height based on h-12
          priority // Add priority as it's likely above the fold (LCP)
        />
        <span className="text-white text-2xl font-heading font-semibold lowercase tracking-wide drop-shadow-md">
          adventra
        </span>
      </Link>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-white p-2"
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
        data-testid="mobile-menu-button"
      >
        {isMenuOpen ? (
          <FaTimes className="w-6 h-6" data-testid="mobile-menu-times" />
        ) : (
          <FaBars className="w-6 h-6" data-testid="mobile-menu-bars" />
        )}
      </button>

      {/* Desktop Navigation */}
      <nav
        className="hidden md:flex space-x-6 font-heading font-bold text-white"
        data-testid="desktop-nav"
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="hover:text-primary"
            data-testid={link.dataTestId}
          >
            {link.label}
          </Link>
        ))}
        {authLink.label === 'Logout' ? (
          <button
            onClick={authLink.onClick}
            className="hover:text-primary"
            data-testid={authLink.dataTestId}
          >
            {authLink.label}
          </button>
        ) : (
          <Link
            href={authLink.href}
            className="hover:text-primary"
            data-testid={authLink.dataTestId}
          >
            {authLink.label}
          </Link>
        )}
      </nav>

      {/* Mobile Navigation Menu (Dropdown) */}
      {isMenuOpen && (
        <div
          className="absolute top-full left-0 right-0 bg-primary-light shadow-md md:hidden z-50"
          data-testid="mobile-menu"
        >
          <nav
            className="flex flex-col items-center py-4 space-y-4 font-heading font-bold text-white"
            data-testid="mobile-nav"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-primary w-full text-center py-2"
                data-testid={link.dataTestId}
              >
                {link.label}
              </Link>
            ))}
            {authLink.label === 'Logout' ? (
              <button
                onClick={authLink.onClick}
                className="hover:text-primary w-full text-center py-2"
                data-testid={authLink.dataTestId}
              >
                {authLink.label}
              </button>
            ) : (
              <Link
                href={authLink.href}
                className="hover:text-primary w-full text-center py-2"
                data-testid={authLink.dataTestId}
              >
                {authLink.label}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
