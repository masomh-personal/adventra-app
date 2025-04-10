/**
 * TODO
 * 1) have the photo upload completely separate from the main form
 * 2) Add 4 different checkboxes for adenture preferences
 * 3) Style the radio buttons and checkboxes
 * 4) The photo is being uploaded fine, but it's not showing up in the live preview
 * 5) Add a erturn to dashboard button with left arrow
 * 6) Check styling on everything including the upload file text area
 * 7) Have validation in teh validation folder
 * 8) Check InfoBox styling and make sure it makes sense where the placement is, or maybe use a modal?
 * 9) Use proper label for the skill and adventure preference
 */

import * as Yup from 'yup';
import { useState, useEffect, useRef } from 'react';
import supabase from '@/lib/supabaseClient';
import { getCurrentUserId } from '@/lib/getCurrentUserId';
import withAuth from '@/lib/withAuth';
import FormWrapper from '@/components/FormWrapper';
import FormField from '@/components/FormField';
import InfoBox from '@/components/InfoBox';
import PersonCard from '@/components/PersonCard';
import { CharacterCounter } from '@/components/CharacterCounter';

const validationSchema = Yup.object().shape({
  bio: Yup.string().max(500, 'Bio must be at most 500 characters'),
  adventurePreferences: Yup.array()
    .of(Yup.string())
    .min(1, 'Select at least one adventure preference'),
  skillLevel: Yup.string().required('Skill level is required'),
});

const adventureOptions = [
  { value: 'hiking', label: 'Hiking' },
  { value: 'camping', label: 'Camping' },
  { value: 'rock_climbing', label: 'Rock Climbing' },
  { value: 'photography', label: 'Photography' },
];

const skillOptions = [
  { value: 'novice', label: 'Novice' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];

function EditProfile() {
  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState({
    bio: '',
    adventurePreferences: [],
    skillLevel: '',
    profileImageUrl: '',
  });

  const [infoBox, setInfoBox] = useState({ message: '', variant: 'info' });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const uid = await getCurrentUserId();
      if (!uid) return;
      setUserId(uid);

      const { data, error } = await supabase
        .from('userprofile')
        .select('*')
        .eq('user_id', uid)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data?.profile_image_url) {
        const { data: signedUrlData, error: urlError } = await supabase.storage
          .from('profile-photos')
          .createSignedUrl(`user-${uid}.jpg`, 3600);

        if (!urlError && signedUrlData?.signedUrl) {
          setProfile({
            bio: data.bio || '',
            adventurePreferences: data.adventure_preferences || [],
            skillLevel: data.skill_summary || '',
            profileImageUrl: signedUrlData.signedUrl,
          });
        }
      } else {
        setProfile({
          bio: data?.bio || '',
          adventurePreferences: data?.adventure_preferences || [],
          skillLevel: data?.skill_summary || '',
          profileImageUrl: '',
        });
      }
    };

    fetchData();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    const maxSize = 2 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/png'];

    if (!allowedTypes.includes(file.type)) {
      setInfoBox({ message: 'Only PNG or JPEG images allowed.', variant: 'error' });
      return;
    }

    if (file.size > maxSize) {
      setInfoBox({ message: 'Image must be under 2MB.', variant: 'error' });
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 400;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 300, 400);

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const filePath = `user-${userId}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from('profile-photos')
          .upload(filePath, blob, {
            contentType: 'image/jpeg',
            upsert: true,
            metadata: { owner: userId },
          });

        if (uploadError) {
          console.error('Image upload error:', uploadError);
          setInfoBox({ message: 'Image upload failed.', variant: 'error' });
          return;
        }

        const { data: signedUrlData, error: urlError } = await supabase.storage
          .from('profile-photos')
          .createSignedUrl(filePath, 3600);

        if (!urlError && signedUrlData?.signedUrl) {
          setProfile((prev) => ({
            ...prev,
            profileImageUrl: signedUrlData.signedUrl,
          }));
          setInfoBox({ message: 'Image uploaded successfully!', variant: 'success' });
        }
      }, 'image/jpeg');
    };
  };

  const handleRemovePhoto = async () => {
    if (!userId) return;

    const filePath = `user-${userId}.jpg`;
    const { error } = await supabase.storage.from('profile-photos').remove([filePath]);

    if (error) {
      console.error('Error deleting profile photo:', error);
      setInfoBox({ message: 'Failed to delete photo.', variant: 'error' });
    } else {
      setProfile((prev) => ({ ...prev, profileImageUrl: '' }));
      setInfoBox({ message: 'Profile photo removed.', variant: 'success' });
    }
  };

  const handleSave = async (data) => {
    if (!userId) return;

    try {
      const { error } = await supabase.from('userprofile').upsert(
        {
          user_id: userId,
          bio: data.bio,
          adventure_preferences: data.adventurePreferences,
          skill_summary: data.skillLevel,
          profile_image_url: profile.profileImageUrl,
        },
        { onConflict: 'user_id' }
      );

      if (error) throw error;
      setInfoBox({ message: 'Profile updated successfully!', variant: 'success' });
    } catch (error) {
      console.error('Error saving profile:', error);
      setInfoBox({ message: 'Failed to save profile. Please try again.', variant: 'error' });
    }
  };

  return (
    <div className="w-full flex-grow bg-background text-foreground flex items-center justify-center p-6 font-body">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-8 my-8">
        {infoBox.message && (
          <InfoBox
            message={infoBox.message}
            variant={infoBox.variant}
            testId="edit-profile-infobox"
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormWrapper
            title="Edit Profile"
            validationSchema={validationSchema}
            onSubmit={handleSave}
            defaultValues={profile}
            submitLabel="Save Changes"
          >
            <FormField
              label="Bio"
              id="bio"
              type="textarea"
              placeholder="Tell us about yourself"
              onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
            />
            <CharacterCounter value={profile.bio} maxLength={500} />

            <FormField
              label="Adventure Preferences"
              id="adventurePreferences"
              type="checkbox"
              options={adventureOptions}
              onChange={(e) => {
                const value = e.target.value;
                setProfile((prev) => ({
                  ...prev,
                  adventurePreferences: prev.adventurePreferences.includes(value)
                    ? prev.adventurePreferences.filter((pref) => pref !== value)
                    : [...prev.adventurePreferences, value],
                }));
              }}
            />

            <FormField
              label="Skill Level"
              id="skillLevel"
              type="radio"
              options={skillOptions}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  skillLevel: e.target.value,
                }))
              }
            />

            <div className="mt-4">
              <label htmlFor="profileImage" className="block font-medium mb-1">
                Upload Profile Photo (300×400, max 2MB)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg"
                id="profileImage"
                onChange={handleImageUpload}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
              {profile.profileImageUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="mt-2 text-sm text-red-600 underline"
                >
                  Remove uploaded photo
                </button>
              )}
            </div>
          </FormWrapper>

          <div>
            <h3 className="text-lg font-bold mb-4">Live Preview</h3>
            <PersonCard
              name="Your Profile"
              skillLevel={profile.skillLevel ?? 'N/A'}
              bio={profile.bio ?? 'N/A'}
              adventurePreferences={profile.adventurePreferences}
              imgSrc={profile.profileImageUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(EditProfile);
