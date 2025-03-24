import React, { useState } from 'react';
import { contactFormSchema } from '@/validation/contactSchema';
import FormWrapper from '@/components/FormWrapper';
import FormField from '@/components/FormField';
import { CharacterCounter } from '@/components/CharacterCounter';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const MESSAGE_MAX_LENGTH = 2000;

  // Handle form submission
  const handleSubmit = async (data, { reset }) => {
    console.log('Form data submitted:', data);
    alert('Message sent! (This is a placeholder)');
    setSubmitted(true);
    reset();
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
          {({ register, errors, watch, setValue }) => {
            // Watch the message field to update character counter
            const messageValue = watch('message') || '';

            return (
              <>
                <FormField
                  label="Name"
                  id="name"
                  type="text"
                  placeholder="Your name"
                  register={register}
                  errors={errors}
                />

                <FormField
                  label="Email"
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  register={register}
                  errors={errors}
                />

                <div className="space-y-1">
                  <FormField
                    label="Message"
                    id="message"
                    type="textarea"
                    placeholder="How can we help you?"
                    className="min-h-[120px]"
                    register={register}
                    errors={errors}
                    registerOptions={{
                      maxLength: MESSAGE_MAX_LENGTH,
                      onChange: (e) => {
                        // Get current value
                        let value = e.target.value || '';

                        // Truncate if needed
                        if (value.length > MESSAGE_MAX_LENGTH) {
                          value = value.substring(0, MESSAGE_MAX_LENGTH);
                          e.target.value = value;
                          setValue('message', value, { shouldValidate: true });
                        }
                      },
                    }}
                  />
                  <CharacterCounter value={messageValue} maxLength={MESSAGE_MAX_LENGTH} />
                </div>
              </>
            );
          }}
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
