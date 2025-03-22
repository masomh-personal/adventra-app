import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

/**
 * Reusable Form Wrapper with react-hook-form + Yup validation
 *
 * @param {string} title - The form's title
 * @param {object} validationSchema - Yup validation schema for the form
 * @param {Function} onSubmit - Function to handle valid form submission
 * @param {ReactNode} children - FormField components inside
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
    formState: { errors, isSubmitting },
    reset,
    control,
    watch,
    setValue,
    getValues,
  } = useForm({
    resolver: validationSchema ? yupResolver(validationSchema) : undefined,
    defaultValues,
    mode: 'onBlur',
  });

  // Provide form context to all children
  const formContext = {
    register,
    errors,
    control,
    watch,
    setValue,
    getValues,
    isSubmitting: isSubmitting || loading,
  };

  // Handler for form submission
  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data, { reset, setValue, getValues });
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit, onError)}
      className={`space-y-4 ${className}`}
      role="form"
      {...formProps}
    >
      {title && <h2 className="text-2xl font-heading text-center">{title}</h2>}

      {/* Render children with form context */}
      <div className="space-y-4">
        {React.Children.map(children, (child) => {
          // Check if it's a valid element before adding props
          if (React.isValidElement(child)) {
            // Only pass form context to custom components, not to DOM elements
            if (typeof child.type === 'function') {
              // This is a custom component (like FormField)
              return React.cloneElement(child, { ...formContext, ...child.props });
            } else {
              // This is a DOM element (like p, div, etc.)
              return child;
            }
          }
          return child;
        })}
      </div>

      {/* Submit button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting || loading ? 'Submitting...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
