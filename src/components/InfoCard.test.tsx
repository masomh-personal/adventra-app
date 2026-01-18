import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InfoCard from './InfoCard';

describe('InfoCard', () => {
    describe('Rendering', () => {
        test('renders title and description', () => {
            render(<InfoCard title='Test Title' description='Test description' />);
            expect(screen.getByText('Test Title')).toBeInTheDocument();
            expect(screen.getByText('Test description')).toBeInTheDocument();
        });

        test('renders button when buttonLabel provided', () => {
            render(
                <InfoCard
                    title='Title'
                    description='Desc'
                    buttonLabel='Click Me'
                    onClick={() => {}}
                />,
            );
            expect(screen.getByText('Click Me')).toBeInTheDocument();
        });

        test('renders custom button when button prop provided', () => {
            render(
                <InfoCard
                    title='Title'
                    description='Desc'
                    button={<button data-testid='custom-btn'>Custom</button>}
                />,
            );
            expect(screen.getByTestId('custom-btn')).toBeInTheDocument();
        });

        test('renders image when imgSrc provided', () => {
            render(<InfoCard title='Title' description='Desc' imgSrc='/test.jpg' />);
            expect(screen.getByTestId('infocard-image')).toBeInTheDocument();
        });

        test('renders icon when icon prop provided', () => {
            render(
                <InfoCard
                    title='Title'
                    description='Desc'
                    icon={<span data-testid='icon'>Icon</span>}
                />,
            );
            expect(screen.getByTestId('icon')).toBeInTheDocument();
        });
    });

    describe('Interactions', () => {
        test('calls onClick when button clicked', async () => {
            const handleClick = vi.fn();
            const user = userEvent.setup();
            render(
                <InfoCard
                    title='Title'
                    description='Desc'
                    buttonLabel='Click'
                    onClick={handleClick}
                />,
            );

            await user.click(screen.getByText('Click'));
            expect(handleClick).toHaveBeenCalledTimes(1);
        });
    });

    describe('Props', () => {
        test('accepts custom testId', () => {
            render(<InfoCard title='Title' description='Desc' testId='custom-card' />);
            expect(screen.getByTestId('custom-card')).toBeInTheDocument();
        });

        test('uses default testId when not provided', () => {
            render(<InfoCard title='Title' description='Desc' />);
            expect(screen.getByTestId('infocard-container')).toBeInTheDocument();
        });

        test('button uses custom variant', () => {
            render(
                <InfoCard
                    title='Title'
                    description='Desc'
                    buttonLabel='Danger'
                    onClick={() => {}}
                    buttonVariant='danger'
                />,
            );
            const button = screen.getByText('Danger');
            expect(button).toBeInTheDocument();
        });
    });
});
