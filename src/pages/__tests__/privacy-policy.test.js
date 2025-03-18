import { render, screen } from '@testing-library/react';
import PrivacyPolicyPage from '../privacy-policy';
import '@testing-library/jest-dom';

describe('PrivacyPolicyPage', () => {
  it('renders the main heading', () => {
    render(<PrivacyPolicyPage />);
    expect(screen.getByRole('heading', { name: /privacy policy/i })).toBeInTheDocument();
  });

  it('renders all major section headings', () => {
    render(<PrivacyPolicyPage />);
    const headings = [
      /1\. information we collect/i,
      /2\. how we use your information/i,
      /3\. data sharing & third parties/i,
      /4\. data security/i,
      /5\. your choices & rights/i,
      /6\. children’s privacy/i,
      /7\. changes to this policy/i,
      /8\. contact us/i,
    ];

    headings.forEach((heading) => {
      expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
    });
  });

  it('renders email link to contact for privacy inquiries', () => {
    render(<PrivacyPolicyPage />);
    const emailLink = screen.getByRole('link', { name: /privacy@adventra.com/i });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:privacy@adventra.com');
  });

  it('renders last updated date text', () => {
    render(<PrivacyPolicyPage />);
    expect(screen.getByText(/last updated/i)).toBeInTheDocument();
  });
});
