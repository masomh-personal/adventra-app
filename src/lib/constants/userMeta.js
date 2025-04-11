import { FaHiking, FaCampground, FaMountain, FaCamera } from 'react-icons/fa';

export const adventurePreferences = [
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
  // Add more adventures here...
];

export const skillLevels = [
  { value: 'novice', label: 'Novice' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];
