// tests/pages/search.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';

// 1) Mock supabaseClient so it never throws
jest.mock('@/lib/supabaseClient', () => ({
  createClient: () => ({
    from: () => ({ select: jest.fn().mockResolvedValue({ data: [], error: null }) }),
  }),
}));

// 2) Mock data‐fetching helpers
jest.mock('@/lib/getAllUserProfiles', () => ({ getAllUserProfiles: jest.fn() }));
jest.mock('@/lib/getCurrentUserId', () => ({ getCurrentUserId: jest.fn() }));
jest.mock('@/lib/calcAgeFromBirthdate', () => ({ calcAgeFromBirthdate: jest.fn() }));

// 3) Mock components for easy querying
jest.mock('@/components/LoadingSpinner', () => () => <div>Fetching profiles...</div>);
jest.mock('@/components/PersonCard', () => ({ name }) => (
  <div data-testid="person-card">{name}</div>
));
jest.mock('@/components/Button', () => ({ label, onClick }) => (
  <button onClick={onClick}>{label}</button>
));

// 4) Mock next/router
jest.mock('next/router', () => ({ useRouter: jest.fn() }));

import SearchPage from '@/pages/search';
import { getAllUserProfiles } from '@/lib/getAllUserProfiles';
import { getCurrentUserId } from '@/lib/getCurrentUserId';
import { calcAgeFromBirthdate } from '@/lib/calcAgeFromBirthdate';

describe('SearchPage', () => {
  let mockPush;

  beforeEach(() => {
    mockPush = jest.fn();
    useRouter.mockReturnValue({ push: mockPush });

    getAllUserProfiles.mockResolvedValue([
      {
        user_id: '1',
        user: { name: 'Alice' },
        birthdate: '1990-01-01',
        skill_summary: 'X',
        bio: 'B',
        adventure_preferences: [],
        dating_preferences: [],
        instagram_url: '',
        facebook_url: '',
        profile_image_url: '/a.png',
      },
      {
        user_id: '2',
        user: { name: 'Bob' },
        birthdate: '1990-01-02',
        skill_summary: 'Y',
        bio: 'C',
        adventure_preferences: [],
        dating_preferences: [],
        instagram_url: '',
        facebook_url: '',
        profile_image_url: '/b.png',
      },
    ]);
    getCurrentUserId.mockResolvedValue('1');
    calcAgeFromBirthdate.mockReturnValue(30);
  });

  it('shows loading then renders Alice', async () => {
    render(<SearchPage />);
    expect(screen.getByText('Fetching profiles...')).toBeInTheDocument();

    await waitFor(() => expect(screen.getByTestId('person-card')).toHaveTextContent('Bob'));
  });

  it('advances to Bob when No Match is clicked', async () => {
    render(<SearchPage />);
    await waitFor(() => screen.getByTestId('person-card'));

    userEvent.click(screen.getByText('No Match'));
    await waitFor(() => expect(screen.getByTestId('person-card')).toHaveTextContent('Bob'));
  });

  it('advances to Bob when Interested is clicked', async () => {
    render(<SearchPage />);
    await waitFor(() => screen.getByTestId('person-card'));

    userEvent.click(screen.getByText('Interested'));
    await waitFor(() => expect(screen.getByTestId('person-card')).toHaveTextContent('Bob'));
  });

  it('navigates to messages when Message is clicked', async () => {
    render(<SearchPage />);
    await waitFor(() => screen.getByTestId('person-card'));

    userEvent.click(screen.getByText('Message'));
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('./messages?userId=2'));
  });
});
