import * as yup from 'yup';
import { nameValidation, emailValidation, passwordValidation } from './validationUtils';

export const signupSchema = yup.object().shape({
  name: nameValidation,
  email: emailValidation,
  password: passwordValidation,
});
