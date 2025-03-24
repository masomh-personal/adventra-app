import * as yup from 'yup';

// REUSABLE/SHARED validation rules
export const passwordValidation = yup
  .string()
  .min(10, 'Password must be at least 10 characters')
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character'
  )
  .required('Password is required');

export const emailValidation = yup
  .string()
  .email('Please enter a valid email address')
  .required('Email is required')
  .transform((value) => value.toLowerCase()); // Normalize email to lowercase

export const nameValidation = yup
  .string()
  .trim()
  .required('Name is required')
  .min(2, 'Name must be at least 2 characters');

export const messageValidation = yup
  .string()
  .required('Please enter your message')
  .min(10, 'Message must be at least 10 characters');
