import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import * as yup from 'yup';
import FormWrapper from '@/components/FormWrapper';
import FormField from '@/components/FormField';

// NOTE:The submit button will be disabled initially because the form is invalid.
// To trigger validation errors, we simulate blurring (e.g., via tabbing) or fill fields with invalid values.

describe('Form Integration', () => {
  const contactFormSchema = yup.object({
    fullName: yup.string().required('Name is required'),
    email: yup.string().email('Please enter a valid email').required('Email is required'),
    subject: yup.string().required('Subject is required'),
    message: yup
      .string()
      .required('Message is required')
      .min(10, 'Message must be at least 10 characters'),
    contactType: yup
      .string()
      .required('Please select how you found us')
      .notOneOf([''], 'Please select how you found us'),
    subscribe: yup.boolean(),
  });

  const mockSubmit = jest.fn();

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  const fillField = async (label, value) => {
    const input = screen.getByLabelText(label);
    await userEvent.clear(input);
    await userEvent.type(input, value);
  };

  it('renders all fields and submit button', () => {
    render(
      <FormWrapper
        title="Contact Form"
        validationSchema={contactFormSchema}
        onSubmit={mockSubmit}
        submitLabel="Send Message"
      >
        <FormField label="Full Name" type="text" id="fullName" />
        <FormField label="Email Address" type="email" id="email" />
        <FormField label="Subject" type="text" id="subject" />
        <FormField label="Message" type="textarea" id="message" />
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

    expect(screen.getByText('Contact Form')).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Subject')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
    expect(screen.getByLabelText('How did you find us?')).toBeInTheDocument();
    expect(screen.getByLabelText('Subscribe to newsletter')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send Message' })).toBeInTheDocument();
  });

  it('shows validation errors when fields are empty', async () => {
    render(
      <FormWrapper validationSchema={contactFormSchema} onSubmit={mockSubmit}>
        {(form) => (
          <>
            <FormField label="Full Name" type="text" id="fullName" {...form} />
            <FormField label="Email Address" type="email" id="email" {...form} />
            <FormField label="Subject" type="text" id="subject" {...form} />
            <FormField label="Message" type="textarea" id="message" {...form} />
          </>
        )}
      </FormWrapper>
    );

    // Simulate tabbing through each field to trigger blur
    await userEvent.tab(); // focus Full Name
    await userEvent.tab(); // blur Full Name, focus Email
    await userEvent.tab(); // blur Email, focus Subject
    await userEvent.tab(); // blur Subject, focus Message
    await userEvent.tab(); // blur Message

    // Now check for validation errors
    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Subject is required')).toBeInTheDocument();
    expect(await screen.findByText('Message is required')).toBeInTheDocument();
  });

  it('submits successfully with valid values', async () => {
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

    await fillField('Full Name', 'John Doe');
    await fillField('Email Address', 'john@example.com');
    await fillField('Subject', 'Bug report');
    await fillField('Message', 'This is a complete message for testing.');
    await userEvent.selectOptions(screen.getByLabelText('How did you find us?'), 'search');
    await userEvent.click(screen.getByLabelText('Subscribe to newsletter'));
    await userEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        {
          fullName: 'John Doe',
          email: 'john@example.com',
          subject: 'Bug report',
          message: 'This is a complete message for testing.',
          contactType: 'search',
          subscribe: true,
        },
        expect.anything()
      );
    });
  });

  it('handles field-level validation with registerOptions', async () => {
    render(
      <FormWrapper onSubmit={mockSubmit}>
        {(form) => (
          <>
            <FormField
              label="Username"
              id="username"
              {...form}
              registerOptions={{
                required: 'Username is required',
                minLength: { value: 3, message: 'Username must be at least 3 characters' },
              }}
            />
            <FormField
              label="Password"
              type="password"
              id="password"
              {...form}
              registerOptions={{
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
              }}
            />
          </>
        )}
      </FormWrapper>
    );

    await userEvent.tab(); // focus username
    await userEvent.tab(); // blur username, focus password
    await userEvent.tab(); // blur password

    expect(await screen.findByText('Username is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();

    await fillField('Username', 'ab'); // too short
    await fillField('Password', '1234'); // too short
    await userEvent.tab(); // blur again to trigger error

    expect(await screen.findByText(/at least 3 characters/i)).toBeInTheDocument();
    expect(await screen.findByText(/at least 8 characters/i)).toBeInTheDocument();
  });

  it('submits prefilled form from defaultValues', async () => {
    render(
      <FormWrapper onSubmit={mockSubmit} defaultValues={{ firstName: 'Jane', lastName: 'Doe' }}>
        <FormField label="First Name" id="firstName" />
        <FormField label="Last Name" id="lastName" />
      </FormWrapper>
    );

    expect(screen.getByLabelText('First Name')).toHaveValue('Jane');
    expect(screen.getByLabelText('Last Name')).toHaveValue('Doe');

    await userEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        { firstName: 'Jane', lastName: 'Doe' },
        expect.anything()
      );
    });
  });

  it('renders file input and allows file selection', async () => {
    const file = new File(['file contents'], 'example.png', { type: 'image/png' });
    const mockOnChange = jest.fn();

    render(
      <FormWrapper onSubmit={mockSubmit}>
        <FormField label="Upload File" id="upload" type="file" onChange={mockOnChange} />
      </FormWrapper>
    );

    const input = screen.getByLabelText('Upload File');
    await userEvent.upload(input, file);

    expect(input.files[0]).toBe(file);
    expect(input.files).toHaveLength(1);
    expect(mockOnChange).toHaveBeenCalled();
  });
});
