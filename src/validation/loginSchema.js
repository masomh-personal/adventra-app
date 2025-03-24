import * as yup from 'yup';
import { emailValidation, passwordValidation } from './validationUtils';

export const loginSchema = yup.object().shape({
  email: emailValidation,
  password: passwordValidation,
  rememberMe: yup.boolean().optional(),
});
