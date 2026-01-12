import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { signupSchema } from '@/validation/signupSchema';
import FormWrapper from '@/components/FormWrapper';
import FormField from '@/components/FormField';
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter';
import { account } from '@/lib/appwriteClient';
import { useModal } from '@/contexts/ModalContext';
import Button from '@/components/Button';
import { dbCreateUser } from '@/hooks/dbCreateUser';
import type { SignupFormData } from '@/types/form';
import type { FieldValues } from 'react-hook-form';
import { ID } from 'appwrite';

export default function SignupPage(): React.JSX.Element {
    const router = useRouter();
    const { showErrorModal, showSuccessModal } = useModal();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');

    const handleSignup = async (data: FieldValues): Promise<void> => {
        const signupData = data as SignupFormData;
        setIsSubmitting(true);

        try {
            // Create user account in Appwrite Auth
            const user = await account.create(
                ID.unique(),
                signupData.email,
                signupData.password,
                signupData.name,
            );

            if (!user) {
                return showErrorModal('Signup failed. Please try again.', 'Signup Error');
            }

            // Create custom user record in database (after creating auth user with Appwrite)
            try {
                const birthdateStr =
                    signupData.birthdate instanceof Date
                        ? signupData.birthdate.toISOString().split('T')[0]
                        : String(signupData.birthdate);

                await dbCreateUser({
                    user_id: user.$id,
                    name: signupData.name,
                    email: signupData.email,
                    birthdate: birthdateStr,
                });
            } catch (dbError) {
                const errorMessage = dbError instanceof Error ? dbError.message : 'Unknown error';
                console.error('User created in auth but failed in custom DB:', errorMessage);
                return showErrorModal(
                    'Signup succeeded but an internal error occurred when saving your profile. Please contact support.',
                    'Signup Incomplete',
                );
            }

            // Auto-login after signup (create session)
            try {
                await account.createEmailSession(signupData.email, signupData.password);
            } catch (sessionError) {
                console.error('Session creation error:', sessionError);
                // Continue even if session creation fails - user can log in manually
            }

            // Final success message
            showSuccessModal(
                'Your account is all set — time to lace up those hiking boots and find your next adventuring partner!',
                'Signup Successful!',
                () => router.push('/'),
                'Go to Homepage',
            );
        } catch (err) {
            console.error('Unexpected signup error:', err);
            let errorMessage = 'An unexpected error occurred. Please try again.';
            let errorTitle = 'Signup Error';

            if (err instanceof Error) {
                errorMessage = err.message;

                // Handle duplicate email error
                if (err.message.includes('already') || err.message.includes('exists')) {
                    errorMessage =
                        'This email is already registered. Please log in instead or reset your password if needed.';
                    errorTitle = 'Email Already Registered';
                }
            }

            showErrorModal(errorMessage, errorTitle);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFormError = (errors: unknown): void => {
        console.error('Form validation errors:', errors);
    };

    return (
        <div className='w-full flex-grow bg-background text-foreground flex items-center justify-center p-6 font-body'>
            <div className='w-full max-w-md bg-white shadow-md rounded-lg p-8 my-8'>
                <h2 className='text-3xl font-heading text-center mb-2'>🏕️ Create Your Account</h2>
                <hr className='border-t border-gray-300 mb-6' />

                <FormWrapper
                    validationSchema={signupSchema}
                    onSubmit={handleSignup}
                    onError={handleFormError}
                    submitLabel={isSubmitting ? 'Signing Up...' : 'Sign Up'}
                    loading={isSubmitting}
                >
                    <FormField label='Full Name' type='text' id='name' placeholder='Your name' />

                    <FormField
                        label='Date of Birth'
                        id='birthdate'
                        type='date'
                        registerOptions={{
                            max: new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                                .toISOString()
                                .split('T')[0],
                        }}
                    />

                    <FormField
                        label='Email Address'
                        type='email'
                        id='email'
                        placeholder='you@example.com'
                        autoComplete='email'
                    />

                    <FormField
                        label='Password'
                        id='password'
                        type='password'
                        placeholder='Create a password'
                        autoComplete='new-password'
                        onChange={(
                            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
                        ) => {
                            if (e.target instanceof HTMLInputElement) {
                                setPassword(e.target.value);
                            }
                        }}
                    />

                    <PasswordStrengthMeter password={password} />

                    <FormField
                        label='Confirm Password'
                        type='password'
                        id='confirmPassword'
                        placeholder='Re-enter your password'
                        autoComplete='new-password'
                        onPaste={(
                            e: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>,
                        ) => {
                            if (
                                e.target instanceof HTMLInputElement ||
                                e.target instanceof HTMLTextAreaElement
                            ) {
                                e.preventDefault();
                            }
                        }}
                    />
                </FormWrapper>

                <div className='text-center text-sm mt-4 flex items-center justify-center gap-2 flex-wrap'>
                    Already have an account?
                    <Button
                        as='a'
                        href='/login'
                        label='Log in'
                        variant='secondary'
                        size='sm'
                        className='text-sm px-2 py-1'
                        aria-label='Go to login page'
                        testId='login-button'
                    />
                </div>
            </div>
        </div>
    );
}
