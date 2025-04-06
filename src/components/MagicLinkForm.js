import React from 'react';
import FormWrapper from '@/components/FormWrapper';
import FormField from '@/components/FormField';
import Button from '@/components/Button';
import { emailValidation } from '@/validation/validationUtils';
import * as yup from 'yup';
import { LuArrowLeft } from 'react-icons/lu'; // ← Clean back arrow icon

const schema = yup.object({
  email: emailValidation,
});

/**
 * MagicLinkForm
 * Supabase one-time login form using FormWrapper + FormField + Button.
 *
 * @param {Function} onSubmit - Handles sending magic link
 * @param {Function} onCancel - Handles closing the form
 * @param {boolean} loading - Whether the form is submitting
 */
export default function MagicLinkForm({ onSubmit, onCancel, loading }) {
  return (
    <FormWrapper
      validationSchema={schema}
      onSubmit={({ email }) => onSubmit(email)}
      loading={loading}
      className="animate-fade-in"
      submitLabel="" // Hides FormWrapper's default submit
    >
      {(formContext) => (
        <>
          <FormField
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            {...formContext}
          />

          <div className="flex justify-center gap-4 pt-2">
            <Button
              type="button"
              label="Back to Login"
              variant="outline"
              size="base"
              onClick={onCancel}
              leftIcon={<LuArrowLeft className="h-4 w-4" />}
              testId="cancel-magic"
            />

            <Button
              type="submit"
              label="Send One-Time Link"
              variant="primary"
              size="base"
              isLoading={loading}
              isValid={formContext.isValid}
              testId="submit-magic"
            />
          </div>
        </>
      )}
    </FormWrapper>
  );
}
