import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { contactFormSchema } from '@/validation/contactSchema';
import FormWrapper from '@/components/FormWrapper';
import FormField from '@/components/FormField';
import { CharacterCounter } from '@/components/CharacterCounter';
import InfoBox from '@/components/InfoBox';
import Button from '@/components/Button';
import { HiOutlineMailOpen } from 'react-icons/hi';

const MESSAGE_MAX_LENGTH = 2000;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data, { reset }) => {
    try {
      const response = await fetch('/api/fakeContact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        // NOTE: this should never be thrown
        console.error('Submission failed');
      }

      setSubmitted(true);
      reset();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      // Optionally: show error toast or InfoBox here (if we were using a real api)
    }
  };

  return (
    <div className="w-full flex-grow bg-background text-foreground flex items-center justify-center p-6 font-body">
      <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-8 my-12">
        <h2 className="text-3xl font-heading text-center mb-2 flex items-center justify-center gap-2">
          <HiOutlineMailOpen className="text-primary text-4xl animate-fade-in-up" />
          Contact Us
        </h2>
        <hr className="border-t border-gray-300 mb-6" />

        <p className="text-lg mb-6 text-center">
          Got questions, feedback, or just want to say hello? Drop us a message below or email us at{' '}
          <a
            href="mailto:support@adventra.com"
            className="text-primary hover:underline font-medium"
          >
            support@adventra.com
          </a>
        </p>

        {submitted ? (
          <>
            <InfoBox
              variant="success"
              message="Thanks for reaching out! Your message has been sent successfully. You should hear back from us within 1–2 business days. Hold tight — we appreciate your patience!"
              role="alert"
              testId="success-message"
            />
            <div className="mt-6 flex justify-center gap-4">
              <Button
                label="Return Home"
                variant="primary"
                size="base"
                onClick={() => router.push('/')}
                testId="return-home-btn"
              />
              <Button
                label="Go to Login"
                variant="outline"
                size="base"
                onClick={() => router.push('/login')}
                testId="go-to-login-btn"
              />
            </div>
          </>
        ) : (
          <FormWrapper
            validationSchema={contactFormSchema}
            onSubmit={handleSubmit}
            submitLabel="Send Message"
            className="mt-4"
          >
            {({ register, errors, watch, setValue }) => {
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
                          let value = e.target.value || '';
                          if (value.length > MESSAGE_MAX_LENGTH) {
                            value = value.slice(0, MESSAGE_MAX_LENGTH);
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
        )}
      </div>
    </div>
  );
}
