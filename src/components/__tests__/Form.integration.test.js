import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as yup from 'yup';
import FormWrapper from '../FormWrapper';
import FormField from '../FormField';

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
    await act(async () => {
      fireEvent.change(screen.getByLabelText(label), { target: { value } });
    });
  };

  it('renders all field types and submit button', () => {
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

    await act(async () => {
      fireEvent.submit(screen.getByRole('form'));
    });

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
    await fillField('How did you find us?', 'search');
    fireEvent.click(screen.getByLabelText('Subscribe to newsletter'));

    await act(async () => {
      fireEvent.submit(screen.getByRole('form'));
    });

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
              errors={form.errors}
              register={form.register}
              registerOptions={{
                required: 'Username is required',
                minLength: { value: 3, message: 'Username must be at least 3 characters' },
              }}
            />
            <FormField
              label="Password"
              type="password"
              id="password"
              errors={form.errors}
              register={form.register}
              registerOptions={{
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
              }}
            />
          </>
        )}
      </FormWrapper>
    );

    await act(async () => {
      fireEvent.submit(screen.getByRole('form')); // ensures form-level submit is fired
    });

    expect(await screen.findByText('Username is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();

    await fillField('Username', 'ab');
    await fillField('Password', '1234');

    await act(async () => {
      fireEvent.submit(screen.getByRole('form')); // ensures form-level submit is fired
    });

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

    await act(async () => {
      fireEvent.submit(screen.getByRole('form')); // ensures form-level submit is fired
    });

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        { firstName: 'Jane', lastName: 'Doe' },
        expect.anything()
      );
    });
  });
});
