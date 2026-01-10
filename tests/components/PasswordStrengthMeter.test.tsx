import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter';
import { passwordCriteria } from '@/validation/validationUtils';

describe('PasswordStrengthMeter', () => {
  const getStrengthLabel = (password: string): string => {
    const passed = passwordCriteria.filter((rule) => rule.test(password)).length;
    if (passed <= 2) return 'WEAK';
    if (passed === 3 || passed === 4) return 'MEDIUM';
    return 'STRONG';
  };

  it('renders nothing if password is empty', () => {
    const { container } = render(<PasswordStrengthMeter password="" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders strength label and bar correctly based on password', () => {
    const password = 'Password1'; // Medium strength
    render(<PasswordStrengthMeter password={password} />);

    const label = getStrengthLabel(password);
    expect(screen.getByTestId('strength-value')).toHaveTextContent(label.toUpperCase());

    const bar = screen.getByTestId('strength-bar');
    expect(bar).toBeInTheDocument();
  });

  it('renders all password criteria in the checklist when not all are passed', () => {
    render(<PasswordStrengthMeter password="weak" />);
    passwordCriteria.forEach((rule) => {
      expect(screen.getByText(rule.label)).toBeInTheDocument();
    });
  });

  it('displays passed rules in green and failed rules in red when checklist is visible', () => {
    const password = 'Password1'; // Not strong enough to hide checklist
    render(<PasswordStrengthMeter password={password} />);

    passwordCriteria.forEach((rule) => {
      const item = screen.getByText(rule.label);
      if (rule.test(password)) {
        expect(item).toHaveClass('text-green-700');
      } else {
        expect(item).toHaveClass('text-red-500');
      }
    });
  });

  it('correctly switches strength label based on password strength', () => {
    const testCases = [
      { password: 'pw', label: 'WEAK' },
      { password: 'Password1', label: 'MEDIUM' },
      { password: 'Password1@#', label: 'STRONG' },
    ];

    testCases.forEach(({ password, label }) => {
      const { unmount } = render(<PasswordStrengthMeter password={password} />);
      expect(screen.getByText(label)).toBeInTheDocument();
      unmount();
    });
  });

  it('displays success message and hides checklist when all password criteria are satisfied', () => {
    const password = 'Password1@'; // Assumes this satisfies all criteria
    render(<PasswordStrengthMeter password={password} />);

    // Checklist should not be in the DOM
    expect(screen.queryByTestId('checklist')).not.toBeInTheDocument();

    // Success message should be shown
    expect(screen.getByTestId('all-passed-message')).toBeInTheDocument();
    expect(screen.getByTestId('all-passed-message')).toHaveTextContent(
      'Fantastic! Your password meets all requirements'
    );
  });
});
