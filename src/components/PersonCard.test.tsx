import { render, screen } from '@testing-library/react';
import PersonCard from './PersonCard';

describe('PersonCard', () => {
    describe('Rendering', () => {
        test('renders name', () => {
            render(<PersonCard name='John Doe' />);
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        test('shows fallback name when name is missing', () => {
            render(<PersonCard />);
            expect(screen.getByText('Unnamed Explorer')).toBeInTheDocument();
        });

        test('renders age when provided', () => {
            render(<PersonCard name='John' age={25} />);
            expect(screen.getByText('AGE: 25')).toBeInTheDocument();
        });

        test('renders skill level when provided', () => {
            render(<PersonCard name='John' skillLevel='novice' />);
            expect(screen.getByText(/novice/i)).toBeInTheDocument();
        });

        test('renders bio when provided', () => {
            render(<PersonCard name='John' bio='Adventure enthusiast' />);
            expect(screen.getByText('Adventure enthusiast')).toBeInTheDocument();
        });

        test('shows fallback bio when bio is empty', () => {
            render(<PersonCard name='John' bio='' />);
            expect(screen.getByText(/hasn't written a bio/i)).toBeInTheDocument();
        });

        test('renders adventure preferences', () => {
            render(<PersonCard name='John' adventurePreferences={['hiking', 'camping']} />);
            expect(screen.getByTestId('person-card-preferences')).toBeInTheDocument();
        });

        test('shows "None selected" when no preferences', () => {
            render(<PersonCard name='John' adventurePreferences={[]} />);
            expect(screen.getByText('None selected')).toBeInTheDocument();
        });
    });

    describe('Image Handling', () => {
        test('renders image with imgSrc', () => {
            render(<PersonCard name='John' imgSrc='/test.jpg' useNextImage={false} />);
            const img = screen.getByTestId('person-card-image');
            expect(img).toHaveAttribute('src', '/test.jpg');
        });

        test('uses fallback image when imgSrc is not provided', () => {
            render(<PersonCard name='John' useNextImage={false} />);
            const img = screen.getByTestId('person-card-image');
            expect(img).toHaveAttribute('src', '/member_pictures/default.png');
        });
    });

    describe('Social Links', () => {
        test('renders Instagram link when provided', () => {
            render(<PersonCard name='John' instagramUrl='https://instagram.com/test' />);
            const instagramLink = screen.getByLabelText('Instagram Profile');
            expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/test');
        });

        test('renders Facebook link when provided', () => {
            render(<PersonCard name='John' facebookUrl='https://facebook.com/test' />);
            const facebookLink = screen.getByLabelText('Facebook Profile');
            expect(facebookLink).toHaveAttribute('href', 'https://facebook.com/test');
        });
    });
});
