import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required')
    .transform((value) => value.toLowerCase()), // Normalize email to lowercase

  password: yup
    .string()
    .min(10, 'Password must be at least 10 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),

  rememberMe: yup.boolean().optional(),
});
