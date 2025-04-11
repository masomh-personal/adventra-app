import * as Yup from 'yup';

export const editProfileSchema = Yup.object().shape({
  bio: Yup.string()
    .required('Bio is required')
    .min(1, 'Bio cannot be empty')
    .max(500, 'Bio must be at most 500 characters'),
  adventurePreferences: Yup.array()
    .of(Yup.string())
    .min(1, 'Select at least one adventure preference'),
  skillLevel: Yup.string().required('Skill level is required'),
});
