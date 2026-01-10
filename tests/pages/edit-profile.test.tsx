import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import EditProfile from '@/pages/edit-profile';
import * as getUserModule from '@/lib/getCurrentUserId';
import * as getProfileModule from '@/lib/getFullUserProfile';
import { useModal } from '@/contexts/ModalContext';
import supabase from '@/lib/supabaseClient';
import { useRouter } from 'next/router';

// Mock global fetch to simulate profile deletion
global.fetch = jest.fn().mockResolvedValue({
  json: jest.fn().mockResolvedValue({}),
}) as jest.Mock;

// Mock router before component imports
jest.mock('next/router', () => ({ useRouter: jest.fn() }));

// Bypass withAuth HOC
jest.mock('@/lib/withAuth', () => (Component: React.ComponentType<unknown>) => Component);

// Mock supabase
const mockUpsert = jest.fn().mockResolvedValue({ error: null });
const mockUpload = jest.fn().mockResolvedValue({ error: null });

jest.mock('@/lib/supabaseClient', () => ({
  __esModule: true,
  default: {
    from: () => ({ upsert: mockUpsert }),
    storage: {
      from: () => ({ upload: mockUpload }),
    },
  },
}));

jest.mock('@/lib/getCurrentUserId');
jest.mock('@/lib/getFullUserProfile');
jest.mock('@/contexts/ModalContext');

const mockedUseModal = useModal as jest.MockedFunction<typeof useModal>;
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockedSupabase = supabase as jest.Mocked<typeof supabase>;

const mockPush = jest.fn();
const mockShowSuccessModal = jest.fn();
const mockShowErrorModal = jest.fn();
const mockShowConfirmationModal = jest.fn().mockResolvedValue(true);

const hydratedProfile = {
  user: { name: 'Alex Example' },
  age: 30,
  bio: 'Nature lover',
  adventure_preferences: ['hiking'] as string[],
  skill_summary: 'novice',
  profile_image_url: '/profile.jpg',
  instagram_url: 'https://instagram.com/aleexample',
  facebook_url: 'https://facebook.com/aleexample',
  dating_preferences: 'straight' as string,
  user_id: 'user-123',
  birthdate: '1990-01-01',
};

describe('EditProfile Page', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();

    (getUserModule.getCurrentUserId as jest.Mock).mockResolvedValue('user-123');
    (getProfileModule.getFullUserProfile as jest.Mock).mockResolvedValue(hydratedProfile);

    mockedUseModal.mockReturnValue({
      showSuccessModal: mockShowSuccessModal,
      showErrorModal: mockShowErrorModal,
      showConfirmationModal: mockShowConfirmationModal,
      openModal: jest.fn(),
      closeModal: jest.fn(),
      showInfoModal: jest.fn(),
    } as ReturnType<typeof useModal>);

    mockedUseRouter.mockReturnValue({ push: mockPush } as unknown as ReturnType<typeof useRouter>);

    await act(async () => {
      render(<EditProfile />);
    });
  });

  it('renders initial values and disables save button', async () => {
    const bioInput = await screen.findByLabelText('Bio');
    expect(bioInput).toHaveValue('Nature lover');
    expect(screen.getByRole('button', { name: /save changes/i })).toBeDisabled();
  });

  it('enables save on form change and submits', async () => {
    const user = userEvent.setup();

    const bioInput = await screen.findByLabelText('Bio');
    await user.clear(bioInput);
    await user.type(bioInput, 'Wilderness explorer.');

    const saveButton = screen.getByRole('button', { name: /save changes/i });

    await waitFor(() => {
      expect(saveButton).toBeEnabled();
    });

    await user.click(saveButton);

    await waitFor(() => {
      expect(mockUpsert).toHaveBeenCalled();
      expect(mockShowSuccessModal).toHaveBeenCalledWith(
        expect.stringContaining('Profile updated'),
        'Saved'
      );
    });
  });

  it('enables save on multiple form changes and submits', async () => {
    const user = userEvent.setup();

    const bioInput = await screen.findByLabelText('Bio');
    const adventurePreferencesInput = screen.getByLabelText('Hiking');

    await user.clear(bioInput);
    await user.type(bioInput, 'Mountain enthusiast with a love for wildlife.');

    await user.click(adventurePreferencesInput); // Uncheck 'Hiking'
    await user.click(adventurePreferencesInput); // Recheck 'Hiking'

    const intermediateSkillLevelInput = screen.getByLabelText('Intermediate');
    await user.click(intermediateSkillLevelInput);

    const biDatingPreferenceInput = screen.getByLabelText('Bisexual');
    await user.click(biDatingPreferenceInput);

    const saveButton = screen.getByRole('button', { name: /save changes/i });

    await waitFor(() => {
      expect(saveButton).toBeEnabled();
    });

    await user.click(saveButton);

    await waitFor(() => {
      expect(mockUpsert).toHaveBeenCalled();
      expect(mockShowSuccessModal).toHaveBeenCalledWith(
        expect.stringContaining('Profile updated'),
        'Saved'
      );
    });
  });

  it('shows error if supabase upsert fails', async () => {
    const user = userEvent.setup();
    (mockedSupabase.from as jest.Mock)().upsert.mockResolvedValueOnce({ error: new Error('DB error') });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const bioInput = await screen.findByLabelText('Bio');
    await user.clear(bioInput);
    await user.type(bioInput, 'Test error');
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(mockShowErrorModal).toHaveBeenCalledWith('Failed to save profile.', 'Save Error');
    });

    consoleErrorSpy.mockRestore();
  });

  it('uploads image and shows success', async () => {
    const user = userEvent.setup();
    const file = new File(['image'], 'profile.jpg', { type: 'image/jpeg' });

    const fileInput = screen.getByLabelText(/upload \(max 2 MB, JPG\/PNG\)/i);
    await user.upload(fileInput, file);

    const uploadBtn = screen.getByRole('button', { name: /upload photo/i });
    await user.click(uploadBtn);

    await waitFor(() => {
      expect(mockUpload).toHaveBeenCalled();
      expect(mockShowSuccessModal).toHaveBeenCalledWith(
        'Profile image uploaded successfully!',
        'Upload OK'
      );
    });
  });

  it('navigates to dashboard on back button click', async () => {
    const user = userEvent.setup();
    await user.click(await screen.findByRole('button', { name: /back to dashboard/i }));
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('correctly handles Instagram URL input', async () => {
    const user = userEvent.setup();
    const instagramInput = await screen.findByLabelText('Instagram URL');
    expect(instagramInput).toHaveValue('https://instagram.com/aleexample');

    await user.clear(instagramInput);
    await user.type(instagramInput, 'https://instagram.com/updatedProfile');

    const saveButton = screen.getByRole('button', { name: /save changes/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockUpsert).toHaveBeenCalled();
    });
  });

  it('correctly handles Facebook URL input', async () => {
    const user = userEvent.setup();
    const facebookInput = await screen.findByLabelText('Facebook URL');
    expect(facebookInput).toHaveValue('https://facebook.com/aleexample');

    await user.clear(facebookInput);
    await user.type(facebookInput, 'https://facebook.com/updatedProfile');

    const saveButton = screen.getByRole('button', { name: /save changes/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockUpsert).toHaveBeenCalled();
    });
  });
});
