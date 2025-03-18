import { render, screen, fireEvent } from '@testing-library/react';
import ContactPage from '../contact';

describe('ContactPage', () => {
  it('renders the contact heading and info text', () => {
    render(<ContactPage />);
    expect(screen.getByRole('heading', { name: /contact us/i })).toBeInTheDocument();
    expect(screen.getByText(/got questions, feedback, or need support/i)).toBeInTheDocument();
    expect(screen.getByText(/support@adventra.com/i)).toBeInTheDocument();
  });

  it('renders name, email, and message fields', () => {
    render(<ContactPage />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it('submits the form and triggers alert', () => {
    window.alert = jest.fn(); // Mock alert
    render(<ContactPage />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: 'This is a test message.' },
    });

    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    expect(window.alert).toHaveBeenCalledWith('Message sent! (This is a placeholder)');
  });
});
