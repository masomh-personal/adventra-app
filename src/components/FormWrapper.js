import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@/components/Button';

/**
 * Reusable Form Wrapper with react-hook-form + Yup validation
 *
 * @param {string} title - The form's title
 * @param {object} validationSchema - Yup validation schema for the form
 * @param {Function} onSubmit - Function to handle valid form submission
 * @param {ReactNode|Function} children - FormField components inside or function receiving form context
 * @param {object} defaultValues - Default values for the form fields
 * @param {string} submitLabel - Text for the submit button
 * @param {boolean} loading - Whether the form is in a loading state
 * @param {string} className - Additional classes for the form
 * @param {Function} onError - Function to handle form errors
 * @param {object} formProps - Additional props to pass to the form
 */
export default function FormWrapper({
  title,
  validationSchema,
  onSubmit,
  children,
  defaultValues = {},
  submitLabel = 'Submit',
  loading = false,
  className = '',
  onError,
  formProps = {},
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, touchedFields },
    reset,
    control,
    watch,
    setValue,
    getValues,
  } = useForm({
    resolver: validationSchema ? yupResolver(validationSchema) : undefined,
    defaultValues,
    mode: 'onTouched', // Trigger validation on blur/touch
    reValidateMode: 'onChange', // Re-validate when typing after touch
  });

  const isButtonDisabled = loading || isSubmitting || !isValid;

  const formContext = {
    register,
    errors,
    touchedFields,
    control,
    watch,
    setValue,
    getValues,
    isSubmitting: isSubmitting || loading,
    isValid,
  };

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data, { reset, setValue, getValues });
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const shouldRenderSubmitButton = typeof submitLabel === 'string' && submitLabel.trim() !== '';

  return (
    <form
      noValidate
      onSubmit={handleSubmit(handleFormSubmit, onError)}
      className={`space-y-4 ${className}`}
      role="form"
      {...formProps}
    >
      {title && <h2 className="text-2xl font-heading text-center">{title}</h2>}

      <div className="space-y-4">
        {typeof children === 'function'
          ? children(formContext)
          : React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                if (typeof child.type === 'function') {
                  return React.cloneElement(child, { ...formContext, ...child.props });
                }
                return child;
              }
              return child;
            })}
      </div>

      {shouldRenderSubmitButton && (
        <div className="pt-2">
          <Button
            type="submit"
            label={submitLabel}
            isLoading={loading || isSubmitting}
            isValid={isValid}
            disabled={isButtonDisabled}
            className="w-full"
            size="lg"
          />
        </div>
      )}
    </form>
  );
}
