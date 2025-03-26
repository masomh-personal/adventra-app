import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PrivacyPolicyPage from '@/pages/privacy-policy';

describe('PrivacyPolicyPage', () => {
  beforeEach(() => {
    // Mock the Date.prototype.toLocaleDateString to return a consistent date for testing
    const originalToLocaleDateString = Date.prototype.toLocaleDateString;
    jest.spyOn(Date.prototype, 'toLocaleDateString').mockImplementation(function () {
      return 'March 25, 2025';
    });

    // Render the component before each test
    render(<PrivacyPolicyPage />);
  });

  afterEach(() => {
    // Restore the original implementation
    jest.restoreAllMocks();
  });

  describe('Page Structure', () => {
    it('should render the privacy policy title', () => {
      expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    });

    it('should render the introduction paragraph', () => {
      expect(
        screen.getByText(
          /This Privacy Policy outlines how we collect, use, and safeguard your personal information when you interact with our platform/
        )
      ).toBeInTheDocument();
    });

    it('should display the last updated date', () => {
      expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
      expect(screen.getByText(/March 25, 2025/)).toBeInTheDocument();
    });
  });

  describe('Policy Sections', () => {
    it('should render all section headings', () => {
      const sections = [
        '1. Information We Collect',
        '2. How We Use Your Information',
        '3. Data Sharing & Third Parties',
        '4. Data Security',
        '5. Your Choices & Rights',
        "6. Children's Privacy",
        '7. Changes to This Policy',
        '8. Contact Us',
      ];

      sections.forEach((section) => {
        expect(screen.getByText(section)).toBeInTheDocument();
      });
    });

    it('should render the information collection list items', () => {
      const collectionItems = [
        /Account Information/,
        /Adventure Preferences/,
        /Media/,
        /Usage Data/,
      ];

      collectionItems.forEach((item) => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
    });

    it('should render the information usage list items', () => {
      const usageItems = [
        /Create and manage your account/,
        /Personalize your experience/,
        /Improve platform features/,
        /Send updates/,
        /Ensure the platform's security/,
      ];

      usageItems.forEach((item) => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
    });
  });

  describe('Contact Information', () => {
    it('should render the contact email with correct mailto link', () => {
      const emailLink = screen.getByText('privacy@adventra.com');
      expect(emailLink).toBeInTheDocument();
      expect(emailLink).toHaveAttribute('href', 'mailto:privacy@adventra.com');
      expect(emailLink).toHaveClass('text-primary');
      expect(emailLink).toHaveClass('hover:underline');
    });
  });

  describe('Styling and Accessibility', () => {
    it('should have appropriate heading hierarchy', () => {
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveTextContent('Privacy Policy');

      const subHeadings = screen.getAllByRole('heading', { level: 2 });
      expect(subHeadings).toHaveLength(8); // 8 policy sections
    });

    it('should have proper container styling', () => {
      const container = screen.getByText('Privacy Policy').closest('div');
      expect(container).toHaveClass('w-full');
      expect(container).toHaveClass('max-w-3xl');
      expect(container).toHaveClass('bg-white');
      expect(container).toHaveClass('shadow-md');
      expect(container).toHaveClass('rounded-lg');
    });
  });
});
