import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CharacterCounter } from '@/components/CharacterCounter';

describe('CharacterCounter', () => {
  it('displays the correct character count', () => {
    render(<CharacterCounter value="Hello" maxLength={100} />);
    expect(screen.getByRole('character-counter')).toHaveTextContent('5/100');
  });

  it('applies green styling when under 80% of max length', () => {
    render(<CharacterCounter value="Hello" maxLength={100} />);
    expect(screen.getByRole('character-counter')).toHaveClass('text-green-600');
  });

  it('applies amber styling when over 80% of max length', () => {
    const value = 'A'.repeat(81);
    const maxLength = 100;
    render(<CharacterCounter value={value} maxLength={maxLength} />);
    expect(screen.getByRole('character-counter')).toHaveClass('text-amber-500');
  });

  it('applies red styling and bold font when at or over max length', () => {
    const value = 'A'.repeat(100);
    const maxLength = 100;
    render(<CharacterCounter value={value} maxLength={maxLength} />);
    const counter = screen.getByRole('character-counter');
    expect(counter).toHaveClass('text-red-500');
    expect(counter).toHaveClass('font-bold');
  });

  it('handles empty value correctly', () => {
    render(<CharacterCounter value="" maxLength={100} />);
    expect(screen.getByRole('character-counter')).toHaveTextContent('0/100');
  });
});
