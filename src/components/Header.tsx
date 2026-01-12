import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import type { Models } from 'appwrite';
import { account } from '@/lib/appwriteClient';
import { FaBars, FaTimes } from 'react-icons/fa';

interface NavLink {
    href: string;
    label: string;
    dataTestId: string;
    onClick?: () => void;
}

export default function Header(): React.JSX.Element {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Fetch initial session
        const fetchSession = async (): Promise<void> => {
            try {
                const currentUser = await account.get();
                setUser(currentUser || null);
            } catch (_error) {
                // User is not authenticated - this is expected
                setUser(null);
            }
        };

        fetchSession();

        // Close menu when route changes
        const handleRouteChange = (): void => {
            setIsMenuOpen(false);
        };

        router.events.on('routeChangeStart', handleRouteChange);

        // Clean up listeners
        return () => {
            router.events.off('routeChangeStart', handleRouteChange);
        };
        // Note: Appwrite doesn't have a built-in auth state listener like Supabase
        // You may need to implement custom polling or use Appwrite's Realtime (if needed)
    }, [router]);

    // Logout handler
    const handleLogout = async (): Promise<void> => {
        try {
            await account.deleteSession('current');
            setUser(null);
            // Properly await router push
            await router.push('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const toggleMenu = (): void => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Navigation Links (Now conditionally created)
    const baseNavLinks: NavLink[] = [
        { href: '/about', label: 'About', dataTestId: 'about-link' },
        { href: '/contact', label: 'Contact', dataTestId: 'contact-link' },
    ];

    const loggedInNavLinks: NavLink[] = [
        { href: '/dashboard', label: 'Dashboard', dataTestId: 'dashboard-link' },
        ...baseNavLinks,
    ];

    const loggedOutNavLinks: NavLink[] = [
        { href: '/', label: 'Home', dataTestId: 'home-link' },
        ...baseNavLinks,
    ];

    const navLinks = user ? loggedInNavLinks : loggedOutNavLinks;

    // Auth Link (Now conditionally created)
    const authLink: NavLink = user
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
        <header
            className='bg-white shadow-md sticky top-0 z-50 font-body'
            role='banner'
            data-testid='header'
        >
            <div className='container mx-auto px-4 py-3 flex items-center justify-between'>
                {/* Logo */}
                <Link href='/' className='flex items-center space-x-2' data-testid='logo-link'>
                    <Image
                        src='/adventra-logo.png'
                        alt='Adventra Logo'
                        width={40}
                        height={40}
                        className='rounded-full'
                        priority
                    />
                    <span className='text-2xl font-heading text-primary font-bold'>Adventra</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className='hidden md:flex items-center space-x-6' role='navigation'>
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={link.onClick}
                            className='text-gray-700 hover:text-primary transition-colors duration-200'
                            data-testid={link.dataTestId}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href={authLink.href}
                        onClick={authLink.onClick}
                        className='bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors duration-200'
                        data-testid={authLink.dataTestId}
                    >
                        {authLink.label}
                    </Link>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className='md:hidden text-gray-700 hover:text-primary focus:outline-none'
                    onClick={toggleMenu}
                    aria-label='Toggle menu'
                    aria-expanded={isMenuOpen}
                    data-testid='menu-toggle'
                >
                    {isMenuOpen ? <FaTimes className='h-6 w-6' /> : <FaBars className='h-6 w-6' />}
                </button>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <nav
                    className='md:hidden bg-white border-t border-gray-200 py-4'
                    role='navigation'
                    data-testid='mobile-menu'
                >
                    <div className='container mx-auto px-4 flex flex-col space-y-4'>
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={link.onClick}
                                className='text-gray-700 hover:text-primary transition-colors duration-200 py-2'
                                data-testid={`mobile-${link.dataTestId}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href={authLink.href}
                            onClick={authLink.onClick}
                            className='bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors duration-200 text-center'
                            data-testid={`mobile-${authLink.dataTestId}`}
                        >
                            {authLink.label}
                        </Link>
                    </div>
                </nav>
            )}
        </header>
    );
}
