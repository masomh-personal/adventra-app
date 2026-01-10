import type { AdventurePreference, DatingPreference, SkillLevel } from './index';

export interface User {
  user_id: string;
  name: string;
  email: string;
}

export interface UserProfile {
  user_id: string;
  bio?: string | null;
  adventure_preferences?: AdventurePreference[] | null;
  skill_summary?: Record<string, SkillLevel> | null;
  profile_image_url?: string | null;
  birthdate?: string | null;
  instagram_url?: string | null;
  facebook_url?: string | null;
  dating_preferences?: DatingPreference | null;
}

export interface FullUserProfile extends UserProfile {
  user?: {
    name: string;
    email: string;
  } | null;
  age?: number | null;
}

export interface CreateUserData {
  user_id: string;
  name: string;
  email: string;
  birthdate: string;
}

export interface CreateProfileData {
  user_id: string;
  bio?: string;
  adventure_preferences?: AdventurePreference[];
  skill_summary?: Record<string, SkillLevel>;
  profile_image_url?: string;
  birthdate?: string;
  instagram_url?: string;
  facebook_url?: string;
  dating_preferences?: DatingPreference;
}
