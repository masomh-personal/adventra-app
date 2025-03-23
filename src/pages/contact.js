import React, { useState } from 'react';
import { contactFormSchema } from '@/validation/contactSchema';
import FormWrapper from '../components/FormWrapper';
import FormField from '../components/FormField';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  // Handle form submission
  const handleSubmit = async (data, { reset }) => {
    // Placeholder for API call in future sprint
    // TODO
    console.log('Form data submitted:', data);

    // Show success alert
    alert('Message sent! (This is a placeholder)');

    // Update submission state
    setSubmitted(true);

    // Reset form
    reset();

    // Reset submission state after a delay
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 font-body">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h2 className="text-3xl font-heading text-center mb-2">Contact Us</h2>
        <hr className="border-t border-gray-300 mb-6" />

        <p className="text-lg mb-6 text-center">
          Got questions, feedback, or need support? Reach out below or email us at{' '}
          <a href="mailto:support@adventra.com" className="text-primary hover:underline">
            support@adventra.com
          </a>
        </p>

        <FormWrapper
          validationSchema={contactFormSchema}
          onSubmit={handleSubmit}
          className="space-y-4"
          submitLabel="Send Message"
        >
          <FormField
            label="Name"
            id="name"
            type="text"
            placeholder="Your name"
            registerOptions={{ required: true }}
          />

          <FormField
            label="Email"
            id="email"
            type="email"
            placeholder="you@example.com"
            registerOptions={{ required: true }}
          />

          <FormField
            label="Message"
            id="message"
            type="textarea"
            placeholder="How can we help you?"
            registerOptions={{ required: true }}
            className="min-h-[120px]" // Ensure textarea has sufficient height
          />
        </FormWrapper>

        {submitted && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
            Your message has been sent. Thank you for contacting us!
          </div>
        )}
      </div>
    </div>
  );
}
