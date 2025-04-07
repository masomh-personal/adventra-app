import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter';
import { passwordCriteria } from '@/validation/validationUtils';

describe('PasswordStrengthMeter', () => {
  const getStrengthLabel = (password) => {
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
    expect(screen.getByTestId('strength-value')).toHaveTextContent(label);

    const bar = screen.getByTestId('strength-bar');
    expect(bar).toBeInTheDocument();
  });

  it('renders all password criteria in the checklist', () => {
    render(<PasswordStrengthMeter password="weak" />);
    passwordCriteria.forEach((rule) => {
      expect(screen.getByText(rule.label)).toBeInTheDocument();
    });
  });

  it('displays passed rules in green and failed rules in red', () => {
    const password = 'Password1@'; // Should pass all
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
      render(<PasswordStrengthMeter password={password} />);
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });
});
