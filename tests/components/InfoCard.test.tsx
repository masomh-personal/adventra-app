import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InfoCard from '@/components/InfoCard';
import { FaEye } from 'react-icons/fa';
import type { InfoCardProps } from '@/components/InfoCard';

describe('InfoCard', () => {
    const setup = () => userEvent.setup();
    const renderComponent = (props: Partial<InfoCardProps>) =>
        render(<InfoCard {...(props as InfoCardProps)} />);

    test('renders title, description, and button label', () => {
        renderComponent({
            title: 'Test Title',
            description: 'Test Description',
            buttonLabel: 'Test Button',
            testId: 'test-infocard',
        });

        expect(screen.getByTestId('test-infocard')).toBeInTheDocument();
        expect(screen.getByTestId('infocard-title')).toHaveTextContent('Test Title');
        expect(screen.getByTestId('infocard-description')).toHaveTextContent('Test Description');
        expect(screen.getByTestId('infocard-button-test-button')).toBeInTheDocument();
    });

    test('calls onClick when the button is clicked', async () => {
        const user = setup();
        const onClick = jest.fn();
        renderComponent({
            title: 'Test Title',
            description: 'Test Description',
            buttonLabel: 'Test Button',
            onClick,
        });

        await user.click(screen.getByTestId('infocard-button-test-button'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    test('renders an image when imgSrc is provided', () => {
        renderComponent({
            title: 'Test Title',
            description: 'Test Description',
            buttonLabel: 'Test Button',
            imgSrc: '/test-image.jpg',
            imgAlt: 'Test Image',
        });

        const image = screen.getByTestId('infocard-image');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src');
    });

    test('does not render an image when imgSrc is not provided', () => {
        renderComponent({
            title: 'Test Title',
            description: 'Test Description',
            buttonLabel: 'Test Button',
        });

        expect(screen.queryByTestId('infocard-image')).not.toBeInTheDocument();
    });

    test('renders a button icon when buttonIcon is provided', () => {
        renderComponent({
            title: 'Test Title',
            description: 'Test Description',
            buttonLabel: 'Test Button',
            buttonIcon: <FaEye className='mr-2' />,
        });

        const button = screen.getByTestId('infocard-button-test-button');
        expect(button.querySelector('svg')).toBeTruthy();
    });

    test('does not render a button when buttonLabel is not provided', () => {
        renderComponent({
            title: 'Test Title',
            description: 'Test Description',
        });

        expect(screen.queryByTestId('infocard-button-')).not.toBeInTheDocument();
    });
});
