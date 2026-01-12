import * as yup from 'yup';
import { nameValidation, emailValidation, messageValidation } from './validationUtils';

export const contactFormSchema = yup.object().shape({
    name: nameValidation,
    email: emailValidation,
    message: messageValidation,
});

// Export as contactSchema for consistency with naming conventions
export const contactSchema = contactFormSchema;
