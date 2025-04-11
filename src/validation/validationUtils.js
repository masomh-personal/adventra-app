import * as yup from 'yup';

// Centralized criteria used by both Yup and the UI
export const passwordCriteria = [
  {
    label: 'At least 10 characters',
    test: (val) => val?.length >= 10,
    yup: (schema) => schema.min(10, 'Password must be at least 10 characters'),
  },
  {
    label: 'Lowercase letter',
    test: (val) => /[a-z]/.test(val),
    yup: (schema) => schema.matches(/[a-z]/, 'Must include a lowercase letter'),
  },
  {
    label: 'Uppercase letter',
    test: (val) => /[A-Z]/.test(val),
    yup: (schema) => schema.matches(/[A-Z]/, 'Must include an uppercase letter'),
  },
  {
    label: 'Number',
    test: (val) => /\d/.test(val),
    yup: (schema) => schema.matches(/\d/, 'Must include a number'),
  },
  {
    label: 'Special character',
    test: (val) => /[^A-Za-z0-9]/.test(val),
    yup: (schema) => schema.matches(/[^A-Za-z0-9]/, 'Must include a special character'),
  },
];

// Dynamically build Yup schema from criteria array
export const passwordValidation = passwordCriteria.reduce(
  (schema, rule) => rule.yup(schema),
  yup.string().required('Password is required')
);

export const emailValidation = yup
  .string()
  .required('Email is required')
  .email('Please enter a valid email address')
  .matches(/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/, 'Email must include a valid domain like ".com" or ".net"')
  .transform((val) => (typeof val === 'string' ? val.toLowerCase() : val));

export const nameValidation = yup
  .string()
  .trim()
  .required('Name is required')
  .min(2, 'Name must be at least 2 characters');

export const messageValidation = yup
  .string()
  .required('Please enter your message')
  .min(10, 'Message must be at least 10 characters')
  .max(2000, 'Message cannot exceed 2000 characters');

const today = new Date();
const minBirthdate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

export const birthdateValidation = yup
  .date()
  .transform((value, originalValue) => {
    // Handle "" as undefined (so it triggers .required())
    return originalValue === '' ? undefined : value;
  })
  .required('Date of birth is required')
  .max(minBirthdate, 'You must be at least 18 years old');
