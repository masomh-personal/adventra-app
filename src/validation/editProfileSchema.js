import * as Yup from 'yup';
import { datingPreferences } from '@/lib/constants/userMeta';

// Extract the 'value' from each dating preference to use in validation
const dataPrefValues = datingPreferences.map(({ value }) => value);

export const editProfileSchema = Yup.object().shape({
  bio: Yup.string()
    .required('Bio is required')
    .min(1, 'Bio cannot be empty')
    .max(500, 'Bio must be at most 500 characters'),
  adventurePreferences: Yup.array()
    .of(Yup.string())
    .min(1, 'Select at least one adventure preference'),
  skillLevel: Yup.string().required('Skill level is required'),

  // Instagram URL validation (optional, if provided, must be a valid URL)
  instagramUrl: Yup.string().url('Instagram URL must be a valid URL').nullable(), // Allows null value for optional URL

  // Facebook URL validation (optional, if provided, must be a valid URL)
  facebookUrl: Yup.string().url('Facebook URL must be a valid URL').nullable(), // Allows null value for optional URL

  // Dating preferences validation (required)
  datingPreferences: Yup.string()
    .oneOf(dataPrefValues, 'Invalid preference selected')
    .required('Dating preference is required'),
});
