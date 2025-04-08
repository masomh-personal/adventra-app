import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InfoCard from '@/components/InfoCard';
import { FaEye } from 'react-icons/fa';

describe('InfoCard', () => {
  const setup = () => userEvent.setup();
  const renderComponent = (props) => render(<InfoCard {...props} />);

  it('renders title, description, and button label', () => {
    renderComponent({
      title: 'Test Title',
      description: 'Test Description',
      buttonLabel: 'Test Button',
    });

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Test Button' })).toBeInTheDocument();
  });

  it('calls onClick when the button is clicked', async () => {
    const user = setup();
    const onClick = jest.fn();
    renderComponent({
      title: 'Test Title',
      description: 'Test Description',
      buttonLabel: 'Test Button',
      onClick,
    });

    await user.click(screen.getByRole('button', { name: 'Test Button' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders an image when imgSrc is provided', () => {
    renderComponent({
      title: 'Test Title',
      description: 'Test Description',
      buttonLabel: 'Test Button',
      imgSrc: '/test-image.jpg',
      imgAlt: 'Test Image',
    });

    const image = screen.getByAltText('Test Image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src');
  });

  it('does not render an image when imgSrc is not provided', () => {
    renderComponent({
      title: 'Test Title',
      description: 'Test Description',
      buttonLabel: 'Test Button',
    });

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders a button icon when buttonIcon is provided', () => {
    renderComponent({
      title: 'Test Title',
      description: 'Test Description',
      buttonLabel: 'Test Button',
      buttonIcon: <FaEye className="mr-2" />,
    });

    expect(screen.getByTestId('button')).toContainElement(
      screen.getByTestId('button').querySelector('svg')
    );
  });

  it('does not render a button when buttonLabel is not provided', () => {
    renderComponent({
      title: 'Test Title',
      description: 'Test Description',
    });

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
