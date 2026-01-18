// Form types will be defined after validation schemas are converted to TypeScript
// These will be inferred from Yup schemas using InferType

export interface LoginFormData {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface SignupFormData {
    name: string;
    email: string;
    password: string;
    birthdate: Date | string;
    confirmPassword: string;
}

export interface EditProfileFormData {
    name?: string;
    bio?: string;
    birthdate?: Date | string;
    adventurePreferences?: string[];
    skillLevel?: string;
    datingPreferences?: string;
    instagramUrl?: string;
    facebookUrl?: string;
}

export interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

export interface FormFieldOption {
    value: string;
    label: string;
}

export interface CharacterCountOptions {
    value: string;
    maxLength: number;
}
