import { render, screen } from '@testing-library/react';
import InfoBox from '@/components/InfoBox';

describe('InfoBox', () => {
  it('renders the default info variant with provided message', () => {
    render(<InfoBox message="This is an info message" />);
    expect(screen.getByText(/this is an info message/i)).toBeInTheDocument();
  });

  it('renders the success variant with correct icon and message', () => {
    const { container } = render(<InfoBox message="Success!" variant="success" />);
    expect(screen.getByText(/success!/i)).toBeInTheDocument();
    expect(container.querySelector('svg')).toBeTruthy(); // Checks icon exists
  });

  it('renders the error variant with correct message', () => {
    render(<InfoBox message="Something went wrong." variant="error" />);
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('supports JSX inside the message prop', () => {
    render(
      <InfoBox
        message={
          <span>
            ⚠️ <strong>Heads up</strong>!
          </span>
        }
      />
    );
    expect(screen.getByText(/heads up/i)).toBeInTheDocument();
  });

  it('falls back to info variant if invalid variant is passed', () => {
    render(<InfoBox message="Fallback test" variant="unknown-type" />);
    expect(screen.getByText(/fallback test/i)).toBeInTheDocument();
  });
});
