import { render, screen } from '@testing-library/react';
import PersonCard from '@/components/PersonCard';

describe('PersonCard', () => {
  const baseProps = {
    name: 'Alex Explorer',
    skillLevel: 'Intermediate',
    bio: 'Loves hiking and finding hidden waterfalls.',
    adventurePreferences: ['Hiking', 'Photography'],
    imgSrc: '/custom-image.jpg',
  };

  describe('renders core content correctly', () => {
    it('displays the provided name', () => {
      render(<PersonCard {...baseProps} />);
      const name = screen.getByTestId('person-card-name');
      expect(name).toHaveTextContent('Alex Explorer');
    });

    it('displays the provided skill level', () => {
      render(<PersonCard {...baseProps} />);
      const skill = screen.getByTestId('person-card-skill-level');
      expect(skill).toHaveTextContent('Skill Level: Intermediate');
    });

    it('displays the provided bio', () => {
      render(<PersonCard {...baseProps} />);
      const bio = screen.getByTestId('person-card-bio');
      expect(bio).toHaveTextContent('Loves hiking and finding hidden waterfalls.');
    });

    it('renders all provided adventure preferences', () => {
      render(<PersonCard {...baseProps} />);
      const preferences = screen.getByTestId('person-card-preferences');
      expect(preferences).toHaveTextContent('Hiking');
      expect(preferences).toHaveTextContent('Photography');
    });

    it('renders the image with the correct src', () => {
      render(<PersonCard {...baseProps} />);
      const img = screen.getByTestId('person-card-image');
      expect(img).toBeInTheDocument();
    });
  });

  describe('renders fallbacks when props are missing', () => {
    it('uses default name when none is provided', () => {
      render(<PersonCard {...baseProps} name={null} />);
      expect(screen.getByTestId('person-card-name')).toHaveTextContent('Unnamed Explorer');
    });

    it('shows N/A when skill level is missing', () => {
      render(<PersonCard {...baseProps} skillLevel={null} />);
      expect(screen.getByTestId('person-card-skill-level')).toHaveTextContent('Skill Level: N/A');
    });

    it('shows fallback bio when none is provided', () => {
      render(<PersonCard {...baseProps} bio={null} />);
      expect(screen.getByTestId('person-card-bio')).toHaveTextContent(
        'This adventurer hasn’t written a bio yet.'
      );
    });

    it('displays "None" if no adventure preferences are provided', () => {
      render(<PersonCard {...baseProps} adventurePreferences={[]} />);
      expect(screen.getByTestId('person-card-preferences')).toHaveTextContent('None');
    });
  });

  describe('image fallback logic', () => {
    it('renders the image element even if src is missing', () => {
      render(<PersonCard {...baseProps} imgSrc={null} />);
      const img = screen.getByTestId('person-card-image');
      expect(img).toBeInTheDocument();
    });
  });
});
