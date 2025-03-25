import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactPage from '../contact';

// Mock the API service - this would be where your API calls will go
// TODO: update this in future after APIs setup correctly
jest.mock('@/services/api', () => ({
  submitContactForm: jest.fn().mockResolvedValue({ success: true }),
}));

// Mock form components but minimize assumptions about implementation
jest.mock('@/components/FormWrapper', () => {
  return ({ children, onSubmit, submitLabel }) => {
    const handleSubmit = (e) => {
      e.preventDefault();
      const formData = {
        name: document.querySelector('[aria-label="Name"]').value,
        email: document.querySelector('[aria-label="Email"]').value,
        message: document.querySelector('[aria-label="Message"]').value,
      };
      onSubmit(formData, { reset: jest.fn() });
    };

    return (
      <form onSubmit={handleSubmit} data-testid="contact-form">
        {typeof children === 'function'
          ? children({
              register: jest.fn(),
              errors: {},
              watch: jest.fn(),
              setValue: jest.fn(),
            })
          : children}
        <button type="submit">{submitLabel}</button>
      </form>
    );
  };
});

// This approach focuses on rendering what users see, not implementation details
jest.mock('@/components/FormField', () => {
  return ({ label, id, type, placeholder }) => {
    if (type === 'textarea') {
      return (
        <div>
          <label htmlFor={id}>{label}</label>
          <textarea id={id} placeholder={placeholder} aria-label={label} />
        </div>
      );
    }

    return (
      <div>
        <label htmlFor={id}>{label}</label>
        <input id={id} type={type} placeholder={placeholder} aria-label={label} />
      </div>
    );
  };
});

describe('ContactPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders contact form with all required fields', () => {
    render(<ContactPage />);

    expect(screen.getByRole('heading', { name: /contact us/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByText(/send message/i)).toBeInTheDocument();
  });

  it('submits the form and shows success message', async () => {
    render(<ContactPage />);

    // Fill out form
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: 'Test message' },
    });

    // Submit form
    fireEvent.submit(screen.getByTestId('contact-form'));

    // Verify success message appears
    await waitFor(() => {
      expect(screen.getByText(/your message has been sent/i)).toBeInTheDocument();
    });

    // Verify it disappears after timeout
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryByText(/your message has been sent/i)).not.toBeInTheDocument();
  });

  // When you add the API later, you could add a test like this:
  it('calls the API service when submitting the form', async () => {
    const apiService = require('@/services/api');
    render(<ContactPage />);

    // Fill and submit form
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: 'Test message' },
    });

    fireEvent.submit(screen.getByTestId('contact-form'));

    // Check if API was called with correct data
    await waitFor(() => {
      expect(apiService.submitContactForm).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message',
      });
    });
  });
});
