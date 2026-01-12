import React from 'react';
import FormWrapper from '@/components/FormWrapper';
import FormField from '@/components/FormField';
import Button from '@/components/Button';
import { emailValidation } from '@/validation/validationUtils';
import * as yup from 'yup';
import { LuArrowLeft } from 'react-icons/lu';

const schema = yup.object({
    email: emailValidation,
});

interface MagicLinkFormProps {
    onSubmit: (data: { email: string }) => Promise<void> | void;
    onCancel: () => void;
    loading?: boolean;
}

/**
 * MagicLinkForm
 * Supabase one-time login form using FormWrapper + FormField + Button.
 *
 * @param onSubmit - Handles sending magic link
 * @param onCancel - Handles closing the form
 * @param loading - Whether the form is submitting
 */
export default function MagicLinkForm({
    onSubmit,
    onCancel,
    loading = false,
}: MagicLinkFormProps): React.JSX.Element {
    return (
        <FormWrapper
            validationSchema={schema}
            onSubmit={data => {
                const email = (data.email as string)?.toLowerCase() || '';
                return onSubmit({ email });
            }}
            loading={loading}
            className='animate-fade-in'
            submitLabel='' // Hides FormWrapper's default submit
        >
            {formContext => (
                <>
                    <FormField
                        id='email'
                        label='Email'
                        type='email'
                        placeholder='you@example.com'
                        {...formContext}
                    />

                    <div className='flex justify-center gap-4 pt-2'>
                        <Button
                            type='button'
                            label='Back to Login'
                            variant='outline'
                            size='base'
                            onClick={onCancel}
                            leftIcon={<LuArrowLeft className='h-4 w-4' />}
                            testId='cancel-magic'
                        />

                        <Button
                            type='submit'
                            label='Send One-Time Link'
                            variant='primary'
                            size='base'
                            isLoading={loading}
                            isValid={formContext.isValid}
                            testId='submit-magic'
                        />
                    </div>
                </>
            )}
        </FormWrapper>
    );
}
