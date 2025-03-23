import * as yup from 'yup';

// Validation schema for the contact form
export const contactFormSchema = yup.object().shape({
  name: yup.string().required('Please enter your name'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Please enter your email'),
  message: yup
    .string()
    .required('Please enter your message')
    .min(10, 'Message must be at least 10 characters'),
});
