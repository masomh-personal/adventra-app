import { FaHiking, FaCampground, FaMountain, FaCamera } from 'react-icons/fa';

export const adventurePreferences = [
  {
    value: 'hiking',
    label: 'Hiking',
    icon: FaHiking,
    border: 'border-green-600',
    text: 'text-green-700',
  },
  {
    value: 'camping',
    label: 'Camping',
    icon: FaCampground,
    border: 'border-yellow-600',
    text: 'text-yellow-700',
  },
  {
    value: 'rock_climbing',
    label: 'Rock Climbing',
    icon: FaMountain,
    border: 'border-red-600',
    text: 'text-red-700',
  },
  {
    value: 'photography',
    label: 'Photography',
    icon: FaCamera,
    border: 'border-blue-600',
    text: 'text-blue-700',
  },
  // Add more here in the future...
];

export const skillLevels = [
  { value: 'novice', label: 'Novice' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];
