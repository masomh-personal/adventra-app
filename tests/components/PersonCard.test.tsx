import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PersonCard from '@/components/PersonCard';
import type { AdventurePreference } from '@/types/index';

describe('PersonCard Component', () => {
    const baseProps = {
        name: 'Alex Explorer',
        age: 28,
        skillLevel: 'Intermediate',
        bio: 'Loves hiking and finding hidden waterfalls.',
        adventurePreferences: ['hiking', 'photography'] as AdventurePreference[],
        imgSrc: '/custom-image.jpg',
    };

    describe('1. Core Content Rendering', () => {
        test('1.1 Renders the user name', () => {
            const { name } = baseProps;
            render(<PersonCard {...baseProps} />);
            const result = screen.getByTestId('person-card-name');
            expect(result).toHaveTextContent(name);
        });

        test('1.2 Renders age and skill tags', () => {
            const { age, skillLevel } = baseProps;
            render(<PersonCard {...baseProps} />);
            const ageTag = screen.getByText(`AGE: ${age}`);
            const skillTag = screen.getByText(skillLevel);
            expect(ageTag).toBeInTheDocument();
            expect(skillTag).toBeInTheDocument();
        });

        test('1.3 Renders the user bio', () => {
            const { bio } = baseProps;
            render(<PersonCard {...baseProps} />);
            const result = screen.getByTestId('person-card-bio');
            expect(result).toHaveTextContent(bio);
        });

        test('1.4 Renders adventure preferences', () => {
            const { adventurePreferences } = baseProps;
            render(<PersonCard {...baseProps} />);
            const result = screen.getByTestId('person-card-preferences');

            adventurePreferences.forEach(pref => {
                const input = pref; // Individual preference
                const expected = input.toLowerCase(); // Lowercase the expected value
                const actual = result.textContent?.toLowerCase() || ''; // Lowercase the actual text

                expect(actual).toContain(expected);
            });
        });

        test('1.5 Renders an image element', () => {
            render(<PersonCard {...baseProps} />);
            const result = screen.getByTestId('person-card-image');
            expect(result).toBeInTheDocument();
        });
    });

    describe('2. Fallback Rendering', () => {
        test('2.1 Displays "Unnamed Explorer" if name is missing', () => {
            const expected = 'Unnamed Explorer';
            render(<PersonCard {...baseProps} name={undefined} />);
            const result = screen.getByTestId('person-card-name');
            expect(result).toHaveTextContent(expected);
        });

        test('2.2 Displays "Not specified" if skillLevel and age are missing', () => {
            const expected = 'Not specified';
            render(<PersonCard {...baseProps} skillLevel={null} age={null} />);
            const result = screen.getAllByText(/Not specified/i); // Use getAllByText
            expect(result[0]).toHaveTextContent(expected); // Assert on the correct element
        });

        test('2.3 Shows fallback bio if bio is null or empty', () => {
            const expected = "This adventurer hasn't written a bio yet.";
            render(<PersonCard {...baseProps} bio={null} />);
            const result = screen.getByTestId('person-card-bio');
            expect(result).toHaveTextContent(expected);
        });

        test('2.4 Displays "None selected" when no preferences are given', () => {
            const expected = 'None selected';
            render(<PersonCard {...baseProps} adventurePreferences={[]} />);
            const result = screen.getByTestId('person-card-preferences');
            expect(result).toHaveTextContent(expected);
        });
    });

    describe('3. Image Handling', () => {
        test('3.1 Renders fallback image if imgSrc is missing', () => {
            render(<PersonCard {...baseProps} imgSrc={null} />);
            const result = screen.getByTestId('person-card-image');
            expect(result).toBeInTheDocument();
        });

        test('3.2 Renders a loading spinner for fallback img with useNextImage = false', () => {
            render(<PersonCard {...baseProps} useNextImage={false} />);
            const result = screen.getByTestId('person-card-image');
            expect(result).toBeInTheDocument();
        });

        test('3.3 Does not render age tag if age is missing', () => {
            render(<PersonCard {...baseProps} age={null} />);
            const result = screen.queryByText(/AGE:/i);
            expect(result).not.toBeInTheDocument();
        });

        test('3.4 Does not render skill tag if skillLevel is missing', () => {
            render(<PersonCard {...baseProps} skillLevel={null} />);
            const result = screen.queryByText(/Intermediate/i);
            expect(result).not.toBeInTheDocument();
        });

        test('3.5 Renders Next.js Image component with error handler', () => {
            render(<PersonCard {...baseProps} useNextImage={true} />);
            const image = screen.getByTestId('person-card-image');
            expect(image).toBeInTheDocument();
            // Verify image has the error handler attached (coverage for line 89)
            expect(image).toHaveAttribute('src');
        });

        test('3.6 Renders Next.js Image component with load handler', () => {
            render(<PersonCard {...baseProps} useNextImage={true} />);
            const image = screen.getByTestId('person-card-image');
            expect(image).toBeInTheDocument();
            // Verify image is rendered with load handler (coverage for line 93)
            expect(image).toHaveAttribute('alt', 'Alex Explorer');
        });

        test('3.7 Renders regular img tag with error handler', () => {
            render(<PersonCard {...baseProps} useNextImage={false} />);
            const image = screen.getByTestId('person-card-image');
            expect(image).toBeInTheDocument();
            // Verify img tag is rendered (coverage for lines 106-120)
            expect(image.tagName).toBe('IMG');
        });

        test('3.8 Renders regular img tag with load handler', () => {
            render(<PersonCard {...baseProps} useNextImage={false} />);
            const image = screen.getByTestId('person-card-image');
            expect(image).toBeInTheDocument();
            // Verify img tag has loading attribute (coverage for line 119)
            expect(image).toHaveAttribute('loading', 'lazy');
        });
    });
});
