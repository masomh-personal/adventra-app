import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@/components/Button';

/**
 * FormWrapper component for managing forms using React Hook Form and Yup validation.
 *
 * @param {string} title - Optional form title.
 * @param {object} validationSchema - Yup schema for validation.
 * @param {Function} onSubmit - Callback for successful form submission.
 * @param {Function} onError - Callback for validation errors.
 * @param {ReactNode|Function} children - Form children or render function with form contexts.
 * @param {object} defaultValues - Optional default values for the form.
 * @param {string} submitLabel - Submit button text.
 * @param {boolean} loading - Submit loading state.
 * @param {string} className - Additional class names for the form wrapper.
 * @param {object} formProps - Additional props to pass to the <form> element.
 */
export default function FormWrapper({
  title,
  validationSchema,
  onSubmit,
  onError,
  children,
  defaultValues = {},
  submitLabel = 'Submit',
  loading = false,
  className = '',
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
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

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

  const isButtonDisabled = loading || isSubmitting || !isValid;

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data, { reset, setValue, getValues });
    } catch (err) {
      console.error('Form submission error:', err);
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
              if (!React.isValidElement(child)) return child;

              const isCustomComponent = typeof child.type === 'function';
              return isCustomComponent
                ? React.cloneElement(child, { ...formContext, ...child.props })
                : child;
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
