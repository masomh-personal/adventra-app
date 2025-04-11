import * as Yup from 'yup';
import { birthdateValidation } from '@/validation/validationUtils';

export const editProfileSchema = Yup.object().shape({
  bio: Yup.string().max(500, 'Bio must be at most 500 characters'),
  adventurePreferences: Yup.array()
    .of(Yup.string())
    .min(1, 'Select at least one adventure preference'),
  skillLevel: Yup.string().required('Skill level is required'),
  birthdate: birthdateValidation,
});
