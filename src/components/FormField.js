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
  maxHeight,
  maxWidth,
  characterCountOptions,
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
          <div className="flex flex-col gap-2">
            {options.map((option) => (
              <label
                key={option.value}
                htmlFor={`${id}-${option.value}`}
                className="flex items-center gap-1.5 px-2 py-1 rounded-sm border-1 cursor-pointer select-none text-sm font-semibold
                transition-all
                hover:bg-secondary/10
                peer-checked:bg-secondary/10
                peer-checked:border-primary
                peer-checked:text-primary"
              >
                <input
                  type="checkbox"
                  id={`${id}-${option.value}`}
                  value={option.value}
                  {...register(id)}
                  className="hidden peer"
                  disabled={disabled}
                />
                <span className="w-4 h-4 flex items-center justify-center border-2 rounded-sm border-gray-400 peer-checked:border-primary peer-checked:bg-primary peer-checked:shadow-inner">
                  <span className="w-2 h-2 bg-white rounded-sm peer-checked:block hidden" />
                </span>
                {option.label}
              </label>
            ))}
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-3">
            {options.map((option) => (
              <label
                key={option.value}
                htmlFor={`${id}-${option.value}`}
                className="flex items-center gap-1.5 cursor-pointer select-none"
              >
                <input
                  type="radio"
                  id={`${id}-${option.value}`}
                  value={option.value}
                  {...register(id)}
                  className="peer sr-only"
                  disabled={disabled}
                />
                <span className="w-5 h-5 flex items-center justify-center rounded-full border-2 border-gray-400 transition-all duration-200 peer-checked:border-primary peer-checked:bg-primary/20 peer-hover:scale-105 peer-focus-visible:ring-2 peer-focus-visible:ring-primary" />
                <span className="text-sm font-semibold uppercase">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            {...getInputProps()}
            className={`${inputClass} text-sm bg-white text-gray-800`}
          />
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
