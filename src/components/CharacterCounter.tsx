import React from 'react';

interface CharacterCounterProps {
  value?: string;
  maxLength: number;
  className?: string;
}

/**
 * Character counter component for text inputs
 *
 * @param value - Current field value
 * @param maxLength - Maximum allowed characters
 * @param className - Additional CSS classes
 */
export function CharacterCounter({
  value = '',
  maxLength,
  className = '',
}: CharacterCounterProps): React.JSX.Element {
  const charCount = value ? value.length : 0;
  const isNearLimit = charCount > maxLength * 0.8;
  const isAtLimit = charCount >= maxLength;

  return (
    <div
      className={`text-xs font-heading font-bold text-right mt-0 ${className} ${
        isAtLimit ? 'text-red-500 font-bold' : isNearLimit ? 'text-amber-500' : 'text-green-600'
      }`}
      data-testid="char-counter"
      role="character-counter"
    >
      {charCount}/{maxLength}
    </div>
  );
}
