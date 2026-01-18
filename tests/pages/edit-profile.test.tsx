import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Hoist mocks
const {
    mockAccountGet,
    mockGetCurrentUserId,
    mockGetFullUserProfile,
    mockGetPublicProfileImageUrl,
    mockShowErrorModal,
    mockShowSuccessModal,
    mockShowConfirmationModal,
    mockRouterPush,
} = vi.hoisted(() => ({
    mockAccountGet: vi.fn(),
    mockGetCurrentUserId: vi.fn(),
    mockGetFullUserProfile: vi.fn(),
    mockGetPublicProfileImageUrl: vi.fn(),
    mockShowErrorModal: vi.fn(),
    mockShowSuccessModal: vi.fn(),
    mockShowConfirmationModal: vi.fn(),
    mockRouterPush: vi.fn(),
}));

// Mock Appwrite client
vi.mock('@/lib/appwriteClient', () => ({
    account: {
        get: mockAccountGet,
    },
    databases: {},
    storage: {},
    databaseId: 'test-db',
}));

// Mock getCurrentUserId
vi.mock('@/lib/getCurrentUserId', () => ({
    getCurrentUserId: mockGetCurrentUserId,
}));

// Mock getFullUserProfile
vi.mock('@/lib/getFullUserProfile', () => ({
    getFullUserProfile: mockGetFullUserProfile,
}));

// Mock getPublicProfileImageUrl
vi.mock('@/lib/getPublicProfileImageUrl', () => ({
    default: mockGetPublicProfileImageUrl,
}));

// Mock ModalContext
vi.mock('@/contexts/ModalContext', () => ({
    useModal: () => ({
        showErrorModal: mockShowErrorModal,
        showSuccessModal: mockShowSuccessModal,
        showConfirmationModal: mockShowConfirmationModal,
    }),
}));

// Mock Next.js router
vi.mock('next/router', () => ({
    useRouter: () => ({
        push: mockRouterPush,
        replace: vi.fn(),
        pathname: '/edit-profile',
        query: {},
        asPath: '/edit-profile',
        events: { on: vi.fn(), off: vi.fn() },
    }),
}));

// Import after mocks
import EditProfile from '@/pages/edit-profile';

// Mock user
const mockUser = {
    $id: 'user-123',
    name: 'John Doe',
    email: 'john@example.com',
    prefs: {},
};

const mockProfile = {
    user_id: 'user-123',
    bio: 'I love hiking',
    adventure_preferences: ['hiking', 'camping'],
    skill_summary: 'intermediate',
    profile_image_url: 'https://example.com/image.jpg',
    birthdate: '1990-01-01',
    instagram_url: 'https://instagram.com/john',
    facebook_url: 'https://facebook.com/john',
    dating_preferences: 'casual',
    user: { name: 'John Doe', email: 'john@example.com' },
    age: 34,
};

describe('EditProfile Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockRouterPush.mockResolvedValue(true);
        mockAccountGet.mockResolvedValue(mockUser);
        mockGetCurrentUserId.mockResolvedValue('user-123');
        mockGetFullUserProfile.mockResolvedValue(mockProfile);
        mockGetPublicProfileImageUrl.mockReturnValue('https://example.com/image.jpg?v=123');
    });

    describe('Profile Loaded', () => {
        it('displays profile form when loaded', async () => {
            render(<EditProfile />);

            await waitFor(() => {
                expect(screen.getByLabelText(/bio/i)).toBeInTheDocument();
            });
        });

        it('shows live preview card', async () => {
            render(<EditProfile />);

            await waitFor(() => {
                expect(screen.getByText(/live preview/i)).toBeInTheDocument();
            });
        });

        it('shows action buttons', async () => {
            render(<EditProfile />);

            await waitFor(() => {
                expect(screen.getByText(/back to dashboard/i)).toBeInTheDocument();
            });

            expect(screen.getByText(/delete profile/i)).toBeInTheDocument();
        });

        it('shows file upload section', async () => {
            render(<EditProfile />);

            await waitFor(() => {
                expect(screen.getByText(/profile photo/i)).toBeInTheDocument();
            });
        });

        it('shows "No file chosen" initially', async () => {
            render(<EditProfile />);

            await waitFor(() => {
                expect(screen.getByText(/no file chosen/i)).toBeInTheDocument();
            });
        });
    });

    describe('Navigation', () => {
        it('navigates back to dashboard', async () => {
            render(<EditProfile />);
            const user = userEvent.setup();

            await waitFor(() => {
                expect(screen.getByText(/back to dashboard/i)).toBeInTheDocument();
            });

            await user.click(screen.getByText(/back to dashboard/i));

            expect(mockRouterPush).toHaveBeenCalledWith('/dashboard');
        });
    });

    describe('Error Handling', () => {
        it('shows error modal when user session not found', async () => {
            mockGetCurrentUserId.mockResolvedValue(null);

            render(<EditProfile />);

            await waitFor(() => {
                expect(mockShowErrorModal).toHaveBeenCalledWith(
                    'Unable to detect user session.',
                    'Session Error',
                );
            });
        });
    });

    describe('Loading State', () => {
        it('shows loading spinner when profile not yet loaded', async () => {
            mockGetFullUserProfile.mockImplementation(() => new Promise(() => {}));

            render(<EditProfile />);

            // The withAuth HOC shows a spinner, then the page might show its own
            // For now, just verify nothing crashes
            await waitFor(
                () => {
                    // Either we see the form or the loading state
                    const spinner = document.querySelector('.animate-spin');
                    expect(spinner).toBeInTheDocument();
                },
                { timeout: 500 },
            );
        });
    });
});
