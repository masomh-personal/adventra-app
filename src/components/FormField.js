import React from 'react';

/**
 * Reusable Form Field that supports multiple input types with testability & accessibility
 */
export default function FormField({
  label,
  type = 'text',
  id,
  register,
  errors = {},
  placeholder,
  options = [],
  registerOptions = {},
  className = '',
  disabled = false,
  helpText,
  onChange,
  onBlur,
}) {
  const hasError = errors?.[id];
  const registerFn = register || (() => ({}));
  const errorId = `${id}-error`;

  const inputClass = `w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
    hasError ? 'border-red-500' : 'border-gray-300'
  } ${className}`;

  const getInputProps = () => ({
    id,
    placeholder,
    disabled,
    className: inputClass,
    'aria-invalid': hasError ? 'true' : undefined,
    'aria-describedby': hasError ? errorId : undefined,
    ...registerFn(id, {
      ...registerOptions,
      onChange: (e) => {
        registerOptions?.onChange?.(e);
        onChange?.(e);
      },
      onBlur: (e) => {
        registerOptions?.onBlur?.(e);
        onBlur?.(e);
      },
    }),
  });

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select {...getInputProps()}>
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return <textarea rows={4} {...getInputProps()} />;

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              {...getInputProps()}
              className={`h-4 w-4 text-primary focus:ring-primary ${
                hasError ? 'border-red-500' : 'border-gray-300'
              } ${className}`}
            />
            <label htmlFor={id} className="ml-2 block text-sm">
              {label}
            </label>
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {options.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`${id}-${option.value}`}
                  value={option.value}
                  {...registerFn(id, registerOptions)}
                  className={`h-4 w-4 text-primary focus:ring-primary ${
                    hasError ? 'border-red-500' : 'border-gray-300'
                  } ${className}`}
                  disabled={disabled}
                />
                <label htmlFor={`${id}-${option.value}`} className="ml-2 block text-sm">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      default:
        return <input type={type} {...getInputProps()} />;
    }
  };

  return (
    <div className="form-field">
      {type !== 'checkbox' && (
        <label htmlFor={id} className="block font-heading mb-1 font-bold">
          {label}
        </label>
      )}

      {renderInput()}

      {helpText && !hasError && (
        <p className="text-gray-500 text-sm mt-1" id={`${id}-help`}>
          {helpText}
        </p>
      )}

      {hasError && (
        <p
          id={errorId}
          data-testid={`${id}-error`}
          className="text-red-500 text-sm mt-1"
          role="alert"
        >
          {errors[id]?.message}
        </p>
      )}
    </div>
  );
}
