import * as yup from 'yup';
import {
    nameValidation,
    emailValidation,
    passwordValidation,
    birthdateValidation,
} from './validationUtils';

export const signupSchema = yup.object().shape({
    name: nameValidation,
    email: emailValidation,
    password: passwordValidation,
    birthdate: birthdateValidation,
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password'),
});
