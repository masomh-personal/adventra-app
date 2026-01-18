// Shared types and interfaces

export type AdventurePreference = 'hiking' | 'camping' | 'rock_climbing' | 'photography';

export type DatingPreference = 'straight' | 'gay' | 'bi' | 'platonic';

export type SkillLevel = 'novice' | 'intermediate' | 'advanced' | 'expert';

import type { IconType } from 'react-icons';

export interface AdventurePreferenceOption {
    value: AdventurePreference;
    label: string;
    icon: IconType;
    border: string;
    text: string;
    bg: string;
}

export interface DatingPreferenceOption {
    value: DatingPreference;
    label: string;
    icon: IconType;
    border: string;
    text: string;
    bg: string;
}

export interface SkillLevelOption {
    value: SkillLevel;
    label: string;
}

export interface SkillColors {
    label: string;
    border: string;
    text: string;
    bg: string;
}
