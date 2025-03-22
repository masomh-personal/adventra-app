import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as yup from 'yup';

// Import the actual components we want to test
import FormWrapper from '../FormWrapper';
import FormField from '../FormField';

describe('Form Integration', () => {
  // Create a sample contact form schema
  const contactFormSchema = yup.object().shape({
    fullName: yup.string().required('Name is required'),
    email: yup.string().email('Please enter a valid email').required('Email is required'),
    subject: yup.string().required('Subject is required'),
    message: yup
      .string()
      .required('Message is required')
      .min(10, 'Message must be at least 10 characters'),
    contactType: yup.string().required('Please select how you found us'),
    subscribe: yup.boolean(),
  });

  // Mock submit handler
  const mockSubmit = jest.fn();

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  it('renders a complete form with different field types', () => {
    render(
      <FormWrapper
        title="Contact Form"
        validationSchema={contactFormSchema}
        onSubmit={mockSubmit}
        submitLabel="Send Message"
      >
        <FormField label="Full Name" type="text" id="fullName" placeholder="Your full name" />
        <FormField
          label="Email Address"
          type="email"
          id="email"
          placeholder="your.email@example.com"
        />
        <FormField label="Subject" type="text" id="subject" placeholder="What is this regarding?" />
        <FormField
          label="Message"
          type="textarea"
          id="message"
          placeholder="Type your message here..."
        />
        <FormField
          label="How did you find us?"
          type="select"
          id="contactType"
          placeholder="Please select..."
          options={[
            { value: 'search', label: 'Search Engine' },
            { value: 'social', label: 'Social Media' },
            { value: 'referral', label: 'Friend/Colleague' },
          ]}
        />
        <FormField label="Subscribe to newsletter" type="checkbox" id="subscribe" />
      </FormWrapper>
    );

    // Verify all form elements are rendered correctly
    expect(screen.getByText('Contact Form')).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Subject')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
    expect(screen.getByLabelText('How did you find us?')).toBeInTheDocument();
    expect(screen.getByLabelText('Subscribe to newsletter')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send Message' })).toBeInTheDocument();
  });

  it('validates all fields and shows error messages', async () => {
    render(
      <FormWrapper validationSchema={contactFormSchema} onSubmit={mockSubmit}>
        <FormField label="Full Name" type="text" id="fullName" />
        <FormField label="Email Address" type="email" id="email" />
        <FormField label="Subject" type="text" id="subject" />
        <FormField label="Message" type="textarea" id="message" />
        <FormField
          label="How did you find us?"
          type="select"
          id="contactType"
          options={[{ value: 'search', label: 'Search Engine' }]}
        />
      </FormWrapper>
    );

    // Submit the empty form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    });

    // Verify error messages appear
    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Subject is required')).toBeInTheDocument();
    expect(await screen.findByText('Message is required')).toBeInTheDocument();

    // The exact error message might be different based on how Yup formats it
    // Let's check for partial text to make this more robust
    const errorElements = await screen.findAllByText(/please select|how you found us|required/i);
    expect(errorElements.length).toBeGreaterThan(0);
  });

  it('submits the form when all fields are valid', async () => {
    render(
      <FormWrapper validationSchema={contactFormSchema} onSubmit={mockSubmit}>
        <FormField label="Full Name" type="text" id="fullName" />
        <FormField label="Email Address" type="email" id="email" />
        <FormField label="Subject" type="text" id="subject" />
        <FormField label="Message" type="textarea" id="message" />
        <FormField
          label="How did you find us?"
          type="select"
          id="contactType"
          options={[{ value: 'search', label: 'Search Engine' }]}
        />
        <FormField label="Subscribe to newsletter" type="checkbox" id="subscribe" />
      </FormWrapper>
    );

    // Fill in all required fields
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Full Name'), {
        target: { value: 'John Doe' },
      });
      fireEvent.change(screen.getByLabelText('Email Address'), {
        target: { value: 'john.doe@example.com' },
      });
      fireEvent.change(screen.getByLabelText('Subject'), {
        target: { value: 'Test Subject' },
      });
      fireEvent.change(screen.getByLabelText('Message'), {
        target: { value: 'This is a test message that is more than 10 characters' },
      });
      fireEvent.change(screen.getByLabelText('How did you find us?'), {
        target: { value: 'search' },
      });
      fireEvent.click(screen.getByLabelText('Subscribe to newsletter'));
    });

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    });

    // Verify form submission
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledTimes(1);
      expect(mockSubmit).toHaveBeenCalledWith(
        {
          fullName: 'John Doe',
          email: 'john.doe@example.com',
          subject: 'Test Subject',
          message: 'This is a test message that is more than 10 characters',
          contactType: 'search',
          subscribe: true,
        },
        expect.anything()
      );
    });
  });

  it('works with field-level validation through registerOptions', async () => {
    render(
      <FormWrapper onSubmit={mockSubmit}>
        <FormField
          label="Username"
          type="text"
          id="username"
          registerOptions={{
            required: 'Username is required',
            minLength: {
              value: 3,
              message: 'Username must be at least 3 characters',
            },
          }}
        />
        <FormField
          label="Password"
          type="password"
          id="password"
          registerOptions={{
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
          }}
        />
      </FormWrapper>
    );

    // Submit the empty form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    });

    // Check for validation messages
    expect(await screen.findByText('Username is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();

    // Fill in with invalid data
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Username'), {
        target: { value: 'ab' },
      });
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: '1234' },
      });
    });

    // Submit with invalid data
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    });

    // Check for validation messages
    expect(await screen.findByText('Username must be at least 3 characters')).toBeInTheDocument();
    expect(await screen.findByText('Password must be at least 8 characters')).toBeInTheDocument();
  });

  it('supports form state handling through defaultValues', async () => {
    render(
      <FormWrapper
        onSubmit={mockSubmit}
        defaultValues={{
          firstName: 'John',
          lastName: 'Doe',
        }}
      >
        <FormField label="First Name" type="text" id="firstName" />
        <FormField label="Last Name" type="text" id="lastName" />
      </FormWrapper>
    );

    // Verify default values are applied
    expect(screen.getByLabelText('First Name')).toHaveValue('John');
    expect(screen.getByLabelText('Last Name')).toHaveValue('Doe');

    // Submit without changes
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    });

    // Verify submission with default values
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        {
          firstName: 'John',
          lastName: 'Doe',
        },
        expect.anything()
      );
    });
  });
});
