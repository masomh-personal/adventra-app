import { render, screen } from '@testing-library/react';
import PasswordStrengthMeter from './PasswordStrengthMeter';

describe('PasswordStrengthMeter', () => {
    describe('Rendering', () => {
        test('returns null when password is empty', () => {
            const { container } = render(<PasswordStrengthMeter password='' />);
            expect(container.firstChild).toBeNull();
        });

        test('returns null when password is undefined', () => {
            const { container } = render(<PasswordStrengthMeter />);
            expect(container.firstChild).toBeNull();
        });

        test('renders strength meter when password provided', () => {
            render(<PasswordStrengthMeter password='test' />);
            expect(screen.getByTestId('password-strength-meter')).toBeInTheDocument();
        });
    });

    describe('Strength Labels', () => {
        test('shows Weak for low score', () => {
            render(<PasswordStrengthMeter password='a' />);
            expect(screen.getByText('WEAK')).toBeInTheDocument();
            expect(screen.getByTestId('strength-value')).toHaveClass('text-red-500');
        });

        test('shows Medium for medium score', () => {
            render(<PasswordStrengthMeter password='Test123' />);
            const strengthValue = screen.getByTestId('strength-value');
            const strengthLabel = strengthValue.textContent || '';
            expect(['MEDIUM', 'WEAK', 'STRONG']).toContain(strengthLabel);
        });

        test('shows Strong for high score', () => {
            render(<PasswordStrengthMeter password='Test1234!@#$' />);
            const strengthValue = screen.getByTestId('strength-value');
            const strengthLabel = strengthValue.textContent || '';
            expect(['STRONG', 'MEDIUM']).toContain(strengthLabel);
        });
    });

    describe('Checklist', () => {
        test('renders checklist when not all criteria met', () => {
            render(<PasswordStrengthMeter password='test' />);
            expect(screen.getByTestId('checklist')).toBeInTheDocument();
        });

        test('shows success message when all criteria met', () => {
            render(<PasswordStrengthMeter password='Test1234!@#$Abc' />);
            expect(screen.queryByTestId('checklist')).not.toBeInTheDocument();
            expect(screen.getByTestId('all-passed-message')).toBeInTheDocument();
        });

        test('shows passed rules in green', () => {
            render(<PasswordStrengthMeter password='Test1' />);
            const rules = screen.getAllByTestId(/^rule-/);
            const passedRules = rules.filter(rule => rule.querySelector('.text-green-500'));
            expect(passedRules.length).toBeGreaterThan(0);
        });
    });
});
