import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from '@/pages/login';

describe('LoginPage', () => {
  it('renders the Login heading', () => {
    render(<LoginPage />);
    const heading = screen.getByRole('heading', { name: /login/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders the email and password inputs', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('shows an alert when submitting the form', () => {
    window.alert = jest.fn(); // mock alert
    render(<LoginPage />);

    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    expect(window.alert).toHaveBeenCalledWith('Login attempted (placeholder)');
  });

  it('fills out and submits the form', () => {
    window.alert = jest.fn();
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(window.alert).toHaveBeenCalledWith('Login attempted (placeholder)');
  });
});
