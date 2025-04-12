import React, { forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@/components/Button';

/**
 * FormWrapper component for managing forms using React Hook Form and Yup validation.
 */
const FormWrapper = forwardRef(function FormWrapper(
  {
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
  },
  ref
) {
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

  // Expose reset() to parent via ref
  useImperativeHandle(ref, () => ({ reset }));

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
});

export default FormWrapper;
