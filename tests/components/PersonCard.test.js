import { render, screen } from '@testing-library/react';
import PersonCard from '@/components/PersonCard';

describe('PersonCard Component', () => {
  const baseProps = {
    name: 'Alex Explorer',
    age: 28,
    skillLevel: 'Intermediate',
    bio: 'Loves hiking and finding hidden waterfalls.',
    adventurePreferences: ['hiking', 'photography'],
    imgSrc: '/custom-image.jpg',
  };

  describe('1. Core Content Rendering', () => {
    it('1.1 Renders the user name', () => {
      const { name } = baseProps;
      render(<PersonCard {...baseProps} />);
      const result = screen.getByTestId('person-card-name');
      expect(result).toHaveTextContent(name);
    });

    it('1.2 Renders age and skill tags', () => {
      const { age, skillLevel } = baseProps;
      render(<PersonCard {...baseProps} />);
      const ageTag = screen.getByText(`AGE: ${age}`);
      const skillTag = screen.getByText(skillLevel);
      expect(ageTag).toBeInTheDocument();
      expect(skillTag).toBeInTheDocument();
    });

    it('1.3 Renders the user bio', () => {
      const { bio } = baseProps;
      render(<PersonCard {...baseProps} />);
      const result = screen.getByTestId('person-card-bio');
      expect(result).toHaveTextContent(bio);
    });

    it('1.4 Renders adventure preferences', () => {
      const { adventurePreferences } = baseProps;
      render(<PersonCard {...baseProps} />);
      const result = screen.getByTestId('person-card-preferences');

      adventurePreferences.forEach((pref) => {
        const input = pref; // Individual preference
        const expected = input.toLowerCase(); // Lowercase the expected value
        const actual = result.textContent.toLowerCase(); // Lowercase the actual text
        const description = `Contains preference: ${input}`;

        expect(actual).toContain(expected);
      });
    });

    it('1.5 Renders an image element', () => {
      render(<PersonCard {...baseProps} />);
      const result = screen.getByTestId('person-card-image');
      expect(result).toBeInTheDocument();
    });
  });

  describe('2. Fallback Rendering', () => {
    it('2.1 Displays "Unnamed Explorer" if name is missing', () => {
      const expected = 'Unnamed Explorer';
      render(<PersonCard {...baseProps} name={null} />);
      const result = screen.getByTestId('person-card-name');
      expect(result).toHaveTextContent(expected);
    });

    it('2.2 Displays "Not specified" if skillLevel and age are missing', () => {
      const expected = 'Not specified';
      render(<PersonCard {...baseProps} skillLevel={null} age={null} />);
      const result = screen.getAllByText(/Not specified/i); // Use getAllByText
      expect(result[0]).toHaveTextContent(expected); // Assert on the correct element
    });

    it('2.3 Shows fallback bio if bio is null or empty', () => {
      const expected = 'This adventurer hasn’t written a bio yet.';
      render(<PersonCard {...baseProps} bio={null} />);
      const result = screen.getByTestId('person-card-bio');
      expect(result).toHaveTextContent(expected);
    });

    it('2.4 Displays "None selected" when no preferences are given', () => {
      const expected = 'None selected';
      render(<PersonCard {...baseProps} adventurePreferences={[]} />);
      const result = screen.getByTestId('person-card-preferences');
      expect(result).toHaveTextContent(expected);
    });
  });

  describe('3. Image Handling', () => {
    it('3.1 Renders fallback image if imgSrc is missing', () => {
      render(<PersonCard {...baseProps} imgSrc={null} />);
      const result = screen.getByTestId('person-card-image');
      expect(result).toBeInTheDocument();
    });

    it('3.2 Renders a loading spinner for fallback img with useNextImage = false', () => {
      render(<PersonCard {...baseProps} useNextImage={false} />);
      const result = screen.getByTestId('person-card-image');
      expect(result).toBeInTheDocument();
    });

    it('3.3 Does not render age tag if age is missing', () => {
      render(<PersonCard {...baseProps} age={null} />);
      const result = screen.queryByText(/AGE:/i);
      expect(result).not.toBeInTheDocument();
    });

    it('3.4 Does not render skill tag if skillLevel is missing', () => {
      render(<PersonCard {...baseProps} skillLevel={null} />);
      const result = screen.queryByText(/Intermediate/i);
      expect(result).not.toBeInTheDocument();
    });
  });
});
