import React from 'react';

/**
 * Character counter component for text inputs
 *
 * @param {string} value - Current field value
 * @param {number} maxLength - Maximum allowed characters
 */
export function CharacterCounter({ value = '', maxLength }) {
  const charCount = value ? value.length : 0;
  const isNearLimit = charCount > maxLength * 0.8;
  const isAtLimit = charCount >= maxLength;

  return (
    <div
      className={`text-xs font-heading font-bold text-right mt-1 ${
        isAtLimit ? 'text-red-500 font-bold' : isNearLimit ? 'text-amber-500' : 'text-green-600'
      }`}
      data-testid="char-counter"
      role="character-counter"
    >
      {charCount}/{maxLength}
    </div>
  );
}
