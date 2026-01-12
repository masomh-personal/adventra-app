import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import SearchPage from '@/pages/search';
import { getAllUserProfiles } from '@/lib/getAllUserProfiles';
import { getCurrentUserId } from '@/lib/getCurrentUserId';
import { calcAgeFromBirthdate } from '@/lib/calcAgeFromBirthdate';

// Hoist mocks
const {
    mockCreateClient,
    mockGetAllUserProfiles,
    mockGetCurrentUserId,
    mockCalcAgeFromBirthdate,
    mockUseRouter,
} = vi.hoisted(() => {
    const mockCreateClient = vi.fn(() => ({
        from: () => ({ select: vi.fn().mockResolvedValue({ data: [], error: null }) }),
    }));
    const mockGetAllUserProfiles = vi.fn();
    const mockGetCurrentUserId = vi.fn();
    const mockCalcAgeFromBirthdate = vi.fn();
    const mockUseRouter = vi.fn();
    return {
        mockCreateClient,
        mockGetAllUserProfiles,
        mockGetCurrentUserId,
        mockCalcAgeFromBirthdate,
        mockUseRouter,
    };
});

// 1) Mock supabaseClient so it never throws
vi.mock('@/lib/supabaseClient', () => ({
    __esModule: true,
    createClient: mockCreateClient,
}));

// 2) Mock data‐fetching helpers
vi.mock('@/lib/getAllUserProfiles', () => ({
    getAllUserProfiles: mockGetAllUserProfiles,
}));
vi.mock('@/lib/getCurrentUserId', () => ({
    getCurrentUserId: mockGetCurrentUserId,
}));
vi.mock('@/lib/calcAgeFromBirthdate', () => ({
    calcAgeFromBirthdate: mockCalcAgeFromBirthdate,
}));

// 3) Mock components for easy querying
vi.mock('@/components/LoadingSpinner', () => ({
    default: () => <div>Fetching profiles...</div>,
}));
vi.mock('@/components/PersonCard', () => ({
    default: ({ name }: { name?: string }) => <div data-testid="person-card">{name}</div>,
}));
vi.mock('@/components/Button', () => ({
    default: ({ label, onClick }: { label: string; onClick?: () => void }) => (
        <button onClick={onClick}>{label}</button>
    ),
}));

// 4) Mock next/router
vi.mock('next/router', () => ({ useRouter: mockUseRouter }));

const mockedUseRouter = vi.mocked(useRouter);
const mockedGetAllUserProfiles = vi.mocked(getAllUserProfiles);
const mockedGetCurrentUserId = vi.mocked(getCurrentUserId);
const mockedCalcAgeFromBirthdate = vi.mocked(calcAgeFromBirthdate);

describe('SearchPage', () => {
    let mockPush: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockPush = vi.fn();
        mockedUseRouter.mockReturnValue({ push: mockPush } as unknown as ReturnType<
            typeof useRouter
        >);

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

    test('shows loading then renders Alice', async () => {
        render(<SearchPage />);
        expect(screen.getByText('Fetching profiles...')).toBeInTheDocument();

        await waitFor(() => expect(screen.getByTestId('person-card')).toHaveTextContent('Bob'));
    });

    test('advances to Bob when No Match is clicked', async () => {
        render(<SearchPage />);
        await waitFor(() => screen.getByTestId('person-card'));

        const user = userEvent.setup();
        await user.click(screen.getByText('No Match'));
        await waitFor(() => expect(screen.getByTestId('person-card')).toHaveTextContent('Bob'));
    });

    test('advances to Bob when Interested is clicked', async () => {
        render(<SearchPage />);
        await waitFor(() => screen.getByTestId('person-card'));

        const user = userEvent.setup();
        await user.click(screen.getByText('Interested'));
        await waitFor(() => expect(screen.getByTestId('person-card')).toHaveTextContent('Bob'));
    });

    test('navigates to messages when Message is clicked', async () => {
        render(<SearchPage />);
        await waitFor(() => screen.getByTestId('person-card'));

        const user = userEvent.setup();
        await user.click(screen.getByText('Message'));
        await waitFor(() => expect(mockPush).toHaveBeenCalledWith('./messages?userId=2'));
    });
});
