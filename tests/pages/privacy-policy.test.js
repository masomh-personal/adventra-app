import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // Import userEvent
import '@testing-library/jest-dom';
import PrivacyPolicyPage from '@/pages/privacy-policy';

// Consistent date for snapshots and assertions
const MOCK_DATE = 'March 25, 2025';

describe('PrivacyPolicyPage', () => {
  // Mock the Date.prototype.toLocaleDateString before all tests in this suite
  beforeAll(() => {
    // Store the original implementation
    const originalToLocaleDateString = Date.prototype.toLocaleDateString;

    jest.spyOn(Date.prototype, 'toLocaleDateString').mockImplementation(
      function (
        locales, // Keep arguments for potential future use/robustness
        options
      ) {
        // Basic check to ensure it's called similarly to the component
        if (locales === 'en-US' && options?.year === 'numeric') {
          return MOCK_DATE;
        }
        // Fallback to original for other calls if necessary (though unlikely here)
        // @ts-ignore - Allow calling original with 'this' contexts
        return originalToLocaleDateString.call(this, locales, options);
      }
    );
  });

  // Restore the original implementation after all tests
  afterAll(() => {
    jest.restoreAllMocks();
  });

  // Helper function to render and setup userEvent for consistency
  const setup = () => {
    const user = userEvent.setup();
    render(<PrivacyPolicyPage />);
    return { user }; // Return user even if not used in all tests
  };

  it('should render the main title', () => {
    setup();
    // Use getByRole for semantic querying where possible
    expect(screen.getByRole('heading', { name: /privacy policy/i, level: 1 })).toBeInTheDocument();
  });

  it('should render the introduction paragraph', () => {
    setup();
    expect(
      screen.getByText(
        /This Privacy Policy outlines how we collect, use, and safeguard/i // Use regex for flexibility
      )
    ).toBeInTheDocument();
  });

  it('should display the last updated date correctly', () => {
    setup();
    expect(screen.getByText(/Last updated:\s*March 25, 2025/i)).toBeInTheDocument();
  });

  it('should render all section headings', () => {
    setup();
    const sections = [
      /1\. Information We Collect/i,
      /2\. How We Use Your Information/i,
      /3\. Data Sharing & Third Parties/i,
      /4\. Data Security/i,
      /5\. Your Choices & Rights/i,
      /6\. Children’s Privacy/i, // Use ’ instead of ' if that's in the source
      /7\. Changes to This Policy/i,
      /8\. Contact Us/i,
    ];

    sections.forEach((sectionRegex) => {
      expect(screen.getByRole('heading', { name: sectionRegex, level: 2 })).toBeInTheDocument();
    });
  });

  it('should render the information collection list items', () => {
    setup();
    const collectionItems = [
      /Account Information:/i,
      /Adventure Preferences:/i,
      /Media:/i,
      /Usage Data:/i,
    ];

    collectionItems.forEach((itemRegex) => {
      expect(screen.getByText(itemRegex)).toBeInTheDocument();
    });
  });

  it('should render the information usage list items', () => {
    setup();
    const usageItems = [
      /Create and manage your account/i,
      /Personalize your experience/i,
      /Improve platform features/i,
      /Send updates, promotions/i,
      /Ensure the platform’s security/i, // Use ’ instead of '
    ];

    usageItems.forEach((itemRegex) => {
      expect(screen.getByText(itemRegex)).toBeInTheDocument();
    });
  });

  it('should render the contact email as a correct mailto link', () => {
    setup();
    // Find the link specifically by its text content
    const emailLink = screen.getByRole('link', { name: /privacy@adventra\.com/i });

    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:privacy@adventra.com');
  });
});
