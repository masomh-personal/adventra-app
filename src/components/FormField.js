import React from 'react';
import { CharacterCounter } from '@/components/CharacterCounter';

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
  maxHeight, // Optional: Tailwind class for max height
  maxWidth, // Optional: Tailwind class for wrapper width
  characterCountOptions, // Optional: { value, maxLength }
}) {
  const hasError = errors?.[id];
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
    ...register(id, {
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
      case 'textarea':
        return (
          <textarea
            rows={4}
            {...getInputProps()}
            className={`${inputClass} resize-none ${maxHeight || 'max-h-48'}`}
          />
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {options.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${id}-${option.value}`}
                  value={option.value}
                  {...register(id)}
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

      case 'radio':
        return (
          <div className="space-y-2">
            {options.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`${id}-${option.value}`}
                  value={option.value}
                  {...register(id)}
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
    <div className={`form-field ${maxWidth || ''}`}>
      <div className="flex items-center justify-between mb-1">
        <label htmlFor={id} className="block font-heading font-bold">
          {label}
        </label>
        {characterCountOptions && (
          <CharacterCounter
            value={characterCountOptions.value}
            maxLength={characterCountOptions.maxLength}
          />
        )}
      </div>

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
