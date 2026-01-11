import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import AboutPage from '@/pages/about';

describe('AboutPage', () => {
  test('renders main headings and intro text', () => {
    render(<AboutPage />);

    // Check for the main page title
    expect(screen.getByRole('heading', { name: /about adventra/i })).toBeInTheDocument();

    // Check for key section headings
    expect(screen.getByRole('heading', { name: /our mission/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /why adventra/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /what makes us different/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /our future vision/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /frequently asked questions/i })).toBeInTheDocument();

    // Check for intro paragraph content
    expect(screen.getByText(/we believe the best memories are made outside/i)).toBeInTheDocument();
  });

  test('toggles FAQ accordion on click', async () => {
    const user = userEvent.setup();
    render(<AboutPage />);

    const firstFAQQuestion = screen.getByRole('button', {
      name: /is adventra free to use/i,
    });

    expect(firstFAQQuestion).toBeInTheDocument();

    // Initially, answer should not be visible
    expect(screen.queryByText(/adventra is free to join and use/i)).not.toBeInTheDocument();

    // Click to open FAQ
    await user.click(firstFAQQuestion);

    // Now the answer should be visible
    expect(screen.getByText(/adventra is free to join and use/i)).toBeInTheDocument();

    // Click again to close FAQ
    await user.click(firstFAQQuestion);

    // The answer should be hidden again
    expect(screen.queryByText(/adventra is free to join and use/i)).not.toBeInTheDocument();
  });
});
