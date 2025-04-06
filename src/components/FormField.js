import React from 'react';

/**
 * Reusable Form Field that supports multiple input types
 *
 * @param {string} label - Label for the field
 * @param {string} type - Input type (text, email, password, select, textarea, checkbox, radio, etc.)
 * @param {string} id - Unique ID and name for the field
 * @param {Function} register - react-hook-form register function
 * @param {object} errors - Errors from react-hook-form
 * @param {string} placeholder - Placeholder text
 * @param {array} options - Options for select, radio, etc. [{value: '', label: ''}]
 * @param {object} registerOptions - Additional register options (required, min, max, etc.)
 * @param {string} className - Additional classes for the input element
 * @param {boolean} disabled - Whether the field is disabled
 * @param {string} helpText - Optional help text to display below the field
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
}) {
  const hasError = errors && id && errors[id];
  const registerFn = register || (() => ({}));

  const baseInputClasses = `w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
    hasError ? 'border-red-500' : 'border-gray-300'
  } ${className}`;

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <>
            <select
              id={id}
              {...registerFn(id, registerOptions)}
              className={baseInputClasses}
              disabled={disabled}
            >
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
            {hasError && <p className="text-red-500 text-sm mt-1">{errors[id].message}</p>}
          </>
        );

      case 'textarea':
        return (
          <>
            <textarea
              id={id}
              {...registerFn(id, registerOptions)}
              placeholder={placeholder}
              className={baseInputClasses}
              disabled={disabled}
              rows={4}
            />
            {hasError && <p className="text-red-500 text-sm mt-1">{errors[id].message}</p>}
          </>
        );

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={id}
              {...registerFn(id, registerOptions)}
              className={`h-4 w-4 text-primary focus:ring-primary ${
                hasError ? 'border-red-500' : 'border-gray-300'
              } ${className}`}
              disabled={disabled}
            />
            <label htmlFor={id} className="ml-2 block text-sm">
              {label}
            </label>
            {hasError && <p className="text-red-500 text-sm ml-2">{errors[id].message}</p>}
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
            {hasError && <p className="text-red-500 text-sm mt-1">{errors[id].message}</p>}
          </div>
        );

      default:
        return (
          <>
            <input
              type={type}
              id={id}
              {...registerFn(id, registerOptions)}
              placeholder={placeholder}
              className={baseInputClasses}
              disabled={disabled}
            />
            {hasError && <p className="text-red-500 text-sm mt-1">{errors[id].message}</p>}
          </>
        );
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
      {helpText && !hasError && <p className="text-gray-500 text-sm mt-1">{helpText}</p>}
    </div>
  );
}
