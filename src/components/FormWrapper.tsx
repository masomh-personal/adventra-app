import React, { forwardRef, useImperativeHandle, type ReactNode } from 'react';
import FormField from '@/components/FormField';
import {
  useForm,
  type UseFormReturn,
  type FieldValues,
  type UseFormRegister,
  type FieldErrors,
  type Control,
  type UseFormWatch,
  type UseFormSetValue,
  type UseFormGetValues,
  type UseFormTrigger,
  type UseFormGetFieldState,
  type UseFormResetField,
  type UseFormClearErrors,
  type UseFormSetError,
  type UseFormSetFocus,
  type UseFormUnregister,
  type UseFormReset,
  type FormState,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import type { AnyObjectSchema } from 'yup';
import Button from '@/components/Button';

export interface FormContext {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  touchedFields: Partial<Readonly<Record<string, boolean>>>;
  control: Control<FieldValues>;
  watch: UseFormWatch<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  getValues: UseFormGetValues<FieldValues>;
  trigger: UseFormTrigger<FieldValues>;
  getFieldState: UseFormGetFieldState<FieldValues>;
  resetField: UseFormResetField<FieldValues>;
  reset: UseFormReset<FieldValues>;
  clearErrors: UseFormClearErrors<FieldValues>;
  setError: UseFormSetError<FieldValues>;
  setFocus: UseFormSetFocus<FieldValues>;
  unregister: UseFormUnregister<FieldValues>;
  formState: FormState<FieldValues>;
  isSubmitting: boolean;
  isValid: boolean;
}

interface FormWrapperProps {
  title?: string;
  validationSchema?: AnyObjectSchema;
  onSubmit: (
    data: FieldValues,
    helpers: {
      reset: () => void;
      setValue: UseFormReturn<FieldValues>['setValue'];
      getValues: UseFormReturn<FieldValues>['getValues'];
    },
  ) => Promise<void> | void;
  onError?: (errors: FieldValues) => void;
  children: ReactNode | ((context: FormContext) => ReactNode);
  defaultValues?: FieldValues;
  submitLabel?: string;
  loading?: boolean;
  className?: string;
  formProps?: React.FormHTMLAttributes<HTMLFormElement>;
}

export interface FormWrapperRef {
  reset: () => void;
}

const FormWrapper = forwardRef<FormWrapperRef, FormWrapperProps>(function FormWrapper(
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
  ref,
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

  const formState: FormState<FieldValues> = {
    errors,
    isSubmitting,
    isValid,
    touchedFields,
    dirtyFields: {},
    isDirty: false,
    isSubmitted: false,
    isSubmitSuccessful: false,
    submitCount: 0,
    isValidating: false,
    isLoading: false,
    disabled: false,
    validatingFields: {},
    isReady: true,
  };

  const formContext: FormContext = {
    register,
    errors,
    touchedFields,
    control,
    watch,
    setValue,
    getValues,
    trigger: async () => true,
    getFieldState: () => ({
      invalid: false,
      isDirty: false,
      isTouched: false,
      isValidating: false,
      error: undefined,
    }),
    resetField: () => {},
    reset: reset,
    clearErrors: () => {},
    setError: () => {},
    setFocus: () => {},
    unregister: () => {},
    formState,
    isSubmitting: isSubmitting || loading,
    isValid,
  };

  const isButtonDisabled = loading || isSubmitting || !isValid;

  const handleFormSubmit = async (data: FieldValues): Promise<void> => {
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
          : React.Children.map(children, child => {
              if (!React.isValidElement(child)) return child;
              const childComponent = child.type as React.ComponentType<unknown>;
              const isFormField = childComponent === FormField;
              if (isFormField) {
                return React.cloneElement(child as React.ReactElement<Record<string, unknown>>, {
                  register: formContext.register,
                  errors: formContext.errors,
                  ...(child.props as Record<string, unknown>),
                });
              }
              const isCustomComponent = typeof childComponent === 'function';
              if (isCustomComponent) {
                return React.cloneElement(child as React.ReactElement<Record<string, unknown>>, {
                  ...formContext,
                  ...(child.props as Record<string, unknown>),
                });
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
});

export default FormWrapper;
