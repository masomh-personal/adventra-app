import React from 'react';
import { UseFormRegister, FieldErrors, FieldValues, Path } from 'react-hook-form';
import { CharacterCounter } from '@/components/CharacterCounter';
import type { FormFieldOption, CharacterCountOptions } from '@/types/form';

interface FormFieldProps<T extends FieldValues = FieldValues> {
    label?: string;
    type?: 'text' | 'email' | 'password' | 'textarea' | 'checkbox' | 'radio' | 'date' | 'url';
    id: Path<T>;
    register?: UseFormRegister<T>;
    errors?: FieldErrors<T>;
    placeholder?: string;
    options?: FormFieldOption[];
    registerOptions?: Parameters<UseFormRegister<T>>[1];
    className?: string;
    disabled?: boolean;
    helpText?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onPaste?: (e: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    autoComplete?: string;
    maxHeight?: string;
    maxWidth?: string;
    characterCountOptions?: CharacterCountOptions;
}

export default function FormField<T extends FieldValues = FieldValues>({
    label,
    type = 'text',
    id,
    register,
    errors = {} as FieldErrors<T>,
    placeholder,
    options = [],
    registerOptions = {},
    className = '',
    disabled = false,
    helpText,
    onChange,
    onBlur,
    onPaste,
    autoComplete,
    maxHeight,
    maxWidth,
    characterCountOptions,
}: FormFieldProps<T>): React.JSX.Element {
    if (!register) {
        throw new Error(
            'FormField requires register prop. Make sure it is used within a FormWrapper or pass register explicitly.',
        );
    }

    const hasError = errors?.[id];
    const errorId = `${String(id)}-error`;

    const isSingleCheckbox = type === 'checkbox' && options.length === 0;

    const inputClass = `w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
        hasError ? 'border-red-500' : 'border-gray-300'
    } ${className}`;

    const getInputProps = () => ({
        id: String(id),
        placeholder,
        disabled,
        autoComplete,
        className: inputClass,
        'aria-invalid': hasError ? 'true' : undefined,
        'aria-describedby': hasError ? errorId : undefined,
        onPaste,
        ...register(id, {
            ...registerOptions,
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                if (registerOptions?.onChange) {
                    (
                        registerOptions.onChange as (
                            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
                        ) => void
                    )(e);
                }
                onChange?.(e);
            },
            onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                if (registerOptions?.onBlur) {
                    (
                        registerOptions.onBlur as (
                            e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
                        ) => void
                    )(e);
                }
                onBlur?.(e);
            },
        }),
    });

    const renderInput = (): React.JSX.Element => {
        switch (type) {
            case 'textarea':
                return (
                    <textarea
                        rows={4}
                        {...(getInputProps() as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
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
                        <div className='flex flex-col gap-1'>
                            {options.map(option => (
                                <label
                                    key={option.value}
                                    htmlFor={`${String(id)}-${option.value}`}
                                    className='flex items-center gap-2 cursor-pointer select-none py-1'
                                >
                                    <div className='relative h-5 w-5 rounded'>
                                        <input
                                            type='checkbox'
                                            id={`${String(id)}-${option.value}`}
                                            value={option.value}
                                            {...register(id)}
                                            className='peer h-full w-full rounded focus:ring-2 focus:ring-primary text-primary opacity-0 cursor-pointer transition-shadow duration-200'
                                            disabled={disabled}
                                        />
                                        <span className='absolute inset-0 rounded border-2 border-gray-400 shadow-sm peer-checked:border-primary/85 peer-checked:bg-primary/85 transition-all duration-200'></span>
                                    </div>
                                    <span className='text-sm font-medium'>{option.label}</span>
                                </label>
                            ))}
                        </div>
                    );
                }

                return (
                    <div className='flex items-center gap-2'>
                        <div className='relative h-5 w-5 rounded'>
                            <input
                                type='checkbox'
                                id={String(id)}
                                {...register(id)}
                                disabled={disabled}
                                className='peer h-full w-full rounded focus:ring-2 focus:ring-primary text-primary opacity-0 cursor-pointer transition-shadow duration-200'
                            />
                            <span className='absolute inset-0 rounded border-2 border-gray-400 shadow-sm peer-checked:border-primary/85 peer-checked:bg-primary/85 transition-all duration-200'></span>
                        </div>
                        <label htmlFor={String(id)} className='text-sm font-medium'>
                            {label}
                        </label>
                    </div>
                );

            case 'radio':
                return (
                    <div className='space-y-3'>
                        {options.map(option => (
                            <label
                                key={option.value}
                                htmlFor={`${String(id)}-${option.value}`}
                                className='flex items-center gap-1.5 cursor-pointer select-none'
                            >
                                <input
                                    type='radio'
                                    id={`${String(id)}-${option.value}`}
                                    value={option.value}
                                    {...register(id)}
                                    className='peer sr-only'
                                    disabled={disabled}
                                />
                                <span className='relative w-5 h-5 flex items-center justify-center rounded-full border-2 border-gray-400 transition-all duration-200 peer-checked:border-primary peer-checked:bg-primary/85 peer-hover:scale-105 peer-focus-visible:ring-2 peer-focus-visible:ring-primary'>
                                    <span className='w-2.5 h-2.5 bg-primary rounded-full absolute peer-checked:block peer-checked:scale-110 transition-transform duration-150 hidden' />
                                </span>
                                <span className='text-sm font-semibold'>{option.label}</span>
                            </label>
                        ))}
                    </div>
                );

            case 'date':
                return (
                    <input
                        type='date'
                        {...(getInputProps() as React.InputHTMLAttributes<HTMLInputElement>)}
                        className={`
        ${inputClass}
        text-sm
        bg-white
        text-gray-800
        focus:ring-offset-1
        focus:shadow-md
        transition-all
        duration-200
      `}
                    />
                );

            default:
                return (
                    <input
                        type={type}
                        {...(getInputProps() as React.InputHTMLAttributes<HTMLInputElement>)}
                        className={`
              ${inputClass}
              focus:ring-offset-1
              focus:shadow-md
              transition-all
              duration-200
              placeholder:text-gray-400
              placeholder:font-light
            `}
                    />
                );
        }
    };

    return (
        <div className={`form-field ${maxWidth || ''}`}>
            <div className='flex items-center justify-between mb-1'>
                {label && (
                    <label
                        htmlFor={String(id)}
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
                <p className='text-gray-500 text-sm mt-1' id={`${String(id)}-help`}>
                    {helpText}
                </p>
            )}

            {hasError && (
                <p
                    id={errorId}
                    data-testid={`${String(id)}-error`}
                    className='text-red-500 text-sm mt-1'
                    role='alert'
                >
                    {(errors[id] as { message?: string })?.message}
                </p>
            )}
        </div>
    );
}
