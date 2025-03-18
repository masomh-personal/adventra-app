import { render, screen, fireEvent } from '@testing-library/react';
import HomePage from '../index';
import '@testing-library/jest-dom';
import { useRouter } from 'next/router';

// Mock Next.js useRouter
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('HomePage', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({ push: pushMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders welcome heading and subtext', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: /welcome to adventra/i })).toBeInTheDocument();
    expect(screen.getByText(/a social network for outdoor adventurers/i)).toBeInTheDocument();
  });

  it('renders the Login button', () => {
    render(<HomePage />);
    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toBeInTheDocument();
  });

  it('navigates to login page when Login button is clicked', () => {
    render(<HomePage />);
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);
    expect(pushMock).toHaveBeenCalledWith('/login');
  });

  it('renders sign-up link with correct href', () => {
    render(<HomePage />);
    const signUpLink = screen.getByRole('link', {
      name: /don’t have an account\? sign up today!/i,
    });
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink).toHaveAttribute('href', '/signup');
  });
});
