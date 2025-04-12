// tests/pages/edit-profile.test.js

import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditProfile from '@/pages/edit-profile';

import * as getUserModule from '@/lib/getCurrentUserId';
import * as getProfileModule from '@/lib/getFullUserProfile';
import { useModal } from '@/contexts/ModalContext';
import supabase from '@/lib/supabaseClient';
import { useRouter } from 'next/router';

// Mock router before component imports
jest.mock('next/router', () => ({ useRouter: jest.fn() }));

// Bypass withAuth HOC
jest.mock('@/lib/withAuth', () => (Component) => Component);

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

const mockPush = jest.fn();
const mockShowSuccessModal = jest.fn();
const mockShowErrorModal = jest.fn();

const hydratedProfile = {
  user: { name: 'Alex Example' },
  age: 30,
  bio: 'Nature lover',
  adventure_preferences: ['camping'],
  skill_summary: 'beginner',
  profile_image_url: '/profile.jpg',
};

describe('EditProfile Page', () => {
  beforeEach(async () => {
    jest.clearAllMocks();

    getUserModule.getCurrentUserId.mockResolvedValue('user-123');
    getProfileModule.getFullUserProfile.mockResolvedValue(hydratedProfile);

    useModal.mockReturnValue({
      showSuccessModal: mockShowSuccessModal,
      showErrorModal: mockShowErrorModal,
    });

    useRouter.mockReturnValue({ push: mockPush });

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
    expect(saveButton).toBeEnabled();

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
    supabase.from().upsert.mockResolvedValueOnce({ error: new Error('DB error') });

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

    const fileInput = screen.getByLabelText(/upload.*jpg or png/i);
    await user.upload(fileInput, file);

    const uploadBtn = screen.getByRole('button', { name: /upload photo/i });
    await user.click(uploadBtn);

    await waitFor(() => {
      expect(mockUpload).toHaveBeenCalled();
      expect(mockShowSuccessModal).toHaveBeenCalledWith(
        'Profile image uploaded successfully!',
        'Upload Successful'
      );
    });
  });

  it('navigates to dashboard on back button click', async () => {
    const user = userEvent.setup();
    await user.click(await screen.findByRole('button', { name: /back to dashboard/i }));
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });
});
