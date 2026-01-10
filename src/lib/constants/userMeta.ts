import {
  FaHiking,
  FaCampground,
  FaMountain,
  FaCamera,
  FaHeart,
  FaTransgender,
  FaRainbow,
  FaHandshake,
} from 'react-icons/fa';
import type { DatingPreferenceOption, AdventurePreferenceOption, SkillLevelOption, SkillColors } from '@/types/index';

export const datingPreferences: DatingPreferenceOption[] = [
  {
    value: 'straight',
    label: 'Straight',
    icon: FaHeart,
    border: 'border-pink-500',
    text: 'text-pink-600',
    bg: 'bg-pink-100',
  },
  {
    value: 'gay',
    label: 'Gay',
    icon: FaRainbow,
    border: 'border-purple-500',
    text: 'text-purple-600',
    bg: 'bg-purple-100',
  },
  {
    value: 'bi',
    label: 'Bisexual',
    icon: FaTransgender,
    border: 'border-indigo-500',
    text: 'text-indigo-600',
    bg: 'bg-indigo-100',
  },
  {
    value: 'platonic',
    label: 'Platonic',
    icon: FaHandshake,
    border: 'border-gray-500',
    text: 'text-gray-600',
    bg: 'bg-gray-100',
  },
] as const;

export const adventurePreferences: AdventurePreferenceOption[] = [
  {
    value: 'hiking',
    label: 'Hiking',
    icon: FaHiking,
    border: 'border-green-600',
    text: 'text-green-700',
    bg: 'bg-green-100',
  },
  {
    value: 'camping',
    label: 'Camping',
    icon: FaCampground,
    border: 'border-yellow-600',
    text: 'text-yellow-700',
    bg: 'bg-yellow-100',
  },
  {
    value: 'rock_climbing',
    label: 'Rock Climbing',
    icon: FaMountain,
    border: 'border-red-600',
    text: 'text-red-700',
    bg: 'bg-red-100',
  },
  {
    value: 'photography',
    label: 'Photography',
    icon: FaCamera,
    border: 'border-blue-600',
    text: 'text-blue-700',
    bg: 'bg-blue-100',
  },
] as const;

export const skillLevels: SkillLevelOption[] = [
  { value: 'novice', label: 'Novice' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
] as const;

export const skillColors: Record<string, SkillColors> = {
  novice: {
    label: 'Novice',
    border: 'border-green-400',
    text: 'text-green-700',
    bg: 'bg-green-100',
  },
  intermediate: {
    label: 'Intermediate',
    border: 'border-blue-500',
    text: 'text-blue-800',
    bg: 'bg-blue-100',
  },
  advanced: {
    label: 'Advanced',
    border: 'border-purple-500',
    text: 'text-purple-800',
    bg: 'bg-purple-100',
  },
  expert: {
    label: 'Expert',
    border: 'border-orange-500',
    text: 'text-orange-800',
    bg: 'bg-orange-100',
  },
} as const;
