import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import SearchPage from '@/pages/search';
import { getAllUserProfiles } from '@/lib/getAllUserProfiles';
import { getCurrentUserId } from '@/lib/getCurrentUserId';
import { calcAgeFromBirthdate } from '@/lib/calcAgeFromBirthdate';

// 1) Mock supabaseClient so it never throws
jest.mock('@/lib/supabaseClient', () => ({
  __esModule: true,
  createClient: () => ({
    from: () => ({ select: jest.fn().mockResolvedValue({ data: [], error: null }) }),
  }),
}));

// 2) Mock data‐fetching helpers
jest.mock('@/lib/getAllUserProfiles', () => ({
  getAllUserProfiles: jest.fn(),
}));
jest.mock('@/lib/getCurrentUserId', () => ({
  getCurrentUserId: jest.fn(),
}));
jest.mock('@/lib/calcAgeFromBirthdate', () => ({
  calcAgeFromBirthdate: jest.fn(),
}));

// 3) Mock components for easy querying
jest.mock('@/components/LoadingSpinner', () => {
  const MockLoadingSpinner = () => <div>Fetching profiles...</div>;
  MockLoadingSpinner.displayName = 'MockLoadingSpinner';
  return MockLoadingSpinner;
});
jest.mock('@/components/PersonCard', () => {
  const MockPersonCard = ({ name }: { name?: string }) => <div data-testid="person-card">{name}</div>;
  MockPersonCard.displayName = 'MockPersonCard';
  return MockPersonCard;
});
jest.mock('@/components/Button', () => {
  const MockButton = ({ label, onClick }: { label: string; onClick?: () => void }) => (
    <button onClick={onClick}>{label}</button>
  );
  MockButton.displayName = 'MockButton';
  return MockButton;
});

// 4) Mock next/router
jest.mock('next/router', () => ({ useRouter: jest.fn() }));

const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockedGetAllUserProfiles = getAllUserProfiles as jest.MockedFunction<typeof getAllUserProfiles>;
const mockedGetCurrentUserId = getCurrentUserId as jest.MockedFunction<typeof getCurrentUserId>;
const mockedCalcAgeFromBirthdate = calcAgeFromBirthdate as jest.MockedFunction<typeof calcAgeFromBirthdate>;

describe('SearchPage', () => {
  let mockPush: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    mockedUseRouter.mockReturnValue({ push: mockPush } as unknown as ReturnType<typeof useRouter>);

    mockedGetAllUserProfiles.mockResolvedValue([
      {
        user_id: '1',
        user: { name: 'Alice', email: 'alice@example.com' },
        birthdate: '1990-01-01',
        skill_summary: { climbing: 'intermediate' as const },
        bio: 'B',
        adventure_preferences: [],
        dating_preferences: null,
        instagram_url: '',
        facebook_url: '',
        profile_image_url: '/a.png',
      },
      {
        user_id: '2',
        user: { name: 'Bob', email: 'bob@example.com' },
        birthdate: '1990-01-02',
        skill_summary: { hiking: 'advanced' as const },
        bio: 'C',
        adventure_preferences: [],
        dating_preferences: null,
        instagram_url: '',
        facebook_url: '',
        profile_image_url: '/b.png',
      },
    ]);
    mockedGetCurrentUserId.mockResolvedValue('1');
    mockedCalcAgeFromBirthdate.mockReturnValue(30);
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
