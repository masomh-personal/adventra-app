import { render, screen, fireEvent } from '@testing-library/react';
import SignupPage from '../signup';
import '@testing-library/jest-dom';

describe('SignupPage', () => {
  it('renders the signup heading and link to login', () => {
    render(<SignupPage />);
    expect(screen.getByRole('heading', { name: /create your account/i })).toBeInTheDocument();
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /login here/i })).toHaveAttribute('href', '/login');
  });

  it('renders the name, email, and password input fields', () => {
    render(<SignupPage />);
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('fills out and submits the form, triggering alert', () => {
    window.alert = jest.fn(); // Mock alert
    render(<SignupPage />);

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Jane Doe' },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'jane@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'securePass123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(window.alert).toHaveBeenCalledWith('Signup attempted (placeholder)');
  });
});
