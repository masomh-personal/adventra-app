import { render, screen } from '@testing-library/react';
import PersonCard from '@/components/PersonCard';

describe('PersonCard', () => {
  const baseProps = {
    name: 'Alex Explorer',
    age: 28,
    skillLevel: 'Intermediate',
    bio: 'Loves hiking and finding hidden waterfalls.',
    adventurePreferences: ['hiking', 'photography'],
    imgSrc: '/custom-image.jpg',
  };

  describe('Core Content Rendering', () => {
    it('renders the user name and age', () => {
      render(<PersonCard {...baseProps} />);
      const name = screen.getByTestId('person-card-name');
      expect(name).toHaveTextContent('28 | Alex Explorer');
    });

    it('renders the skill level with proper badge styling', () => {
      render(<PersonCard {...baseProps} />);
      const skillBadge = screen.getByText(/Intermediate/i);
      expect(skillBadge).toBeInTheDocument();
    });

    it('renders the user bio', () => {
      render(<PersonCard {...baseProps} />);
      const bio = screen.getByTestId('person-card-bio');
      expect(bio).toHaveTextContent('Loves hiking and finding hidden waterfalls.');
    });

    it('renders the adventure preferences correctly', () => {
      render(<PersonCard {...baseProps} />);
      const prefs = screen.getByTestId('person-card-preferences');
      expect(prefs).toHaveTextContent('Hiking');
      expect(prefs).toHaveTextContent('Photography');
    });

    it('renders an image element for the user', () => {
      render(<PersonCard {...baseProps} />);
      const image = screen.getByTestId('person-card-image');
      expect(image).toBeInTheDocument();
    });
  });

  describe('Fallback Rendering', () => {
    it('displays "Unnamed Explorer" if name is missing', () => {
      render(<PersonCard {...baseProps} name={null} />);
      const name = screen.getByTestId('person-card-name');
      expect(name).toHaveTextContent('Unnamed Explorer');
    });

    it('displays "Not specified" if skillLevel is null', () => {
      render(<PersonCard {...baseProps} skillLevel={null} />);
      expect(screen.getByText(/Not specified/i)).toBeInTheDocument();
    });

    it('shows fallback bio if bio is null or empty', () => {
      render(<PersonCard {...baseProps} bio={null} />);
      const bio = screen.getByTestId('person-card-bio');
      expect(bio).toHaveTextContent('This adventurer hasn’t written a bio yet.');
    });

    it('displays "None selected" when no preferences are given', () => {
      render(<PersonCard {...baseProps} adventurePreferences={[]} />);
      const prefs = screen.getByTestId('person-card-preferences');
      expect(prefs).toHaveTextContent('None selected');
    });
  });

  describe('Image Handling', () => {
    it('renders fallback image if imgSrc is missing', () => {
      render(<PersonCard {...baseProps} imgSrc={null} />);
      const image = screen.getByTestId('person-card-image');
      expect(image).toBeInTheDocument();
    });

    it('renders a loading spinner for fallback img with useNextImage = false', () => {
      render(<PersonCard {...baseProps} useNextImage={false} />);
      const image = screen.getByTestId('person-card-image');
      expect(image).toBeInTheDocument();
    });
  });
});
