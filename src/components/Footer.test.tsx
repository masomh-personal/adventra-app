import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
    describe('Rendering', () => {
        test('renders navigation links', () => {
            render(<Footer />);
            expect(screen.getByText('About')).toBeInTheDocument();
            expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
            expect(screen.getByText('Contact')).toBeInTheDocument();
        });

        test('renders copyright with current year', () => {
            render(<Footer />);
            const year = new Date().getFullYear();
            expect(screen.getByText(new RegExp(`© ${year} adventra`, 'i'))).toBeInTheDocument();
        });

        test('renders "Made with" attribution', () => {
            render(<Footer />);
            expect(screen.getByText(/Made with/i)).toBeInTheDocument();
        });

        test('renders build version tag with GitHub link', () => {
            render(<Footer />);
            // There are two GitHub links (mobile and desktop versions)
            const repoLinks = screen.getAllByRole('link', { name: /dev-branch/i });
            expect(repoLinks).toHaveLength(2);
            repoLinks.forEach(repoLink => {
                expect(repoLink).toBeInTheDocument();
                expect(repoLink).toHaveAttribute('href', expect.stringContaining('github.com'));
                expect(repoLink).toHaveAttribute('target', '_blank');
            });
        });
    });

    describe('Navigation Links', () => {
        test('About link has correct href', () => {
            render(<Footer />);
            const aboutLink = screen.getByText('About');
            expect(aboutLink.closest('a')).toHaveAttribute('href', '/about');
        });

        test('Privacy Policy link has correct href', () => {
            render(<Footer />);
            const privacyLink = screen.getByText('Privacy Policy');
            expect(privacyLink.closest('a')).toHaveAttribute('href', '/privacy-policy');
        });

        test('Contact link has correct href', () => {
            render(<Footer />);
            const contactLink = screen.getByText('Contact');
            expect(contactLink.closest('a')).toHaveAttribute('href', '/contact');
        });
    });
});
