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

  const isSingleCheckbox = type === 'checkbox' && options.length === 0;

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
            className={`
              ${inputClass}
              resize-none
              ${maxHeight || 'max-h-48'}
              focus:ring-offset-1
              focus:shadow-md
              transition-all
              duration-200
              placeholder:text-gray-400
              placeholder:font-light
            `}
          />
        );

      case 'checkbox':
        if (options.length > 0) {
          return (
            <div className="flex flex-col gap-1">
              {options.map((option) => (
                <label
                  key={option.value}
                  htmlFor={`${id}-${option.value}`}
                  className="flex items-center gap-2 cursor-pointer select-none py-1"
                >
                  <div className="relative h-5 w-5 rounded">
                    <input
                      type="checkbox"
                      id={`${id}-${option.value}`}
                      value={option.value}
                      {...register(id)}
                      className="peer h-full w-full rounded focus:ring-2 focus:ring-primary text-primary opacity-0 cursor-pointer transition-shadow duration-200"
                      disabled={disabled}
                    />
                    <span className="absolute inset-0 rounded border-2 border-gray-400 shadow-sm peer-checked:border-primary/85 peer-checked:bg-primary/85 transition-all duration-200"></span>
                  </div>
                  <span className="text-sm font-medium">{option.label}</span>
                </label>
              ))}
            </div>
          );
        }

        return (
          <div className="flex items-center gap-2">
            <div className="relative h-5 w-5 rounded">
              <input
                type="checkbox"
                id={id}
                {...register(id)}
                disabled={disabled}
                className="peer h-full w-full rounded focus:ring-2 focus:ring-primary text-primary opacity-0 cursor-pointer transition-shadow duration-200"
              />
              <span className="absolute inset-0 rounded border-2 border-gray-400 shadow-sm peer-checked:border-primary/85 peer-checked:bg-primary/85 transition-all duration-200"></span>
            </div>
            <label htmlFor={id} className="text-sm font-medium">
              {label}
            </label>
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
                <span className="relative w-5 h-5 flex items-center justify-center rounded-full border-2 border-gray-400 transition-all duration-200 peer-checked:border-primary peer-checked:bg-primary/85 peer-hover:scale-105 peer-focus-visible:ring-2 peer-focus-visible:ring-primary">
                  <span className="w-2.5 h-2.5 bg-primary rounded-full absolute peer-checked:block peer-checked:scale-110 transition-transform duration-150 hidden" />
                </span>
                <span className="text-sm font-semibold">{option.label}</span>
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
        {label && (
          <label
            htmlFor={id}
            className={`block font-heading font-bold ${isSingleCheckbox ? 'sr-only' : ''}`}
          >
            {label}
          </label>
        )}

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
