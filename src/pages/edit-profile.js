import { useRef, useState } from 'react';
import supabase from '@/lib/supabaseClient';
import withAuth from '@/lib/withAuth';
import { getCurrentUserId } from '@/lib/getCurrentUserId';
import getPublicProfileImageUrl from '@/lib/getPublicProfileImageUrl';
import getFullUserProfile from '@/lib/getFullUserProfile';
import useRunOnce from '@/hooks/useRunOnce';
import { adventurePreferences, skillLevels } from '@/lib/constants/userMeta';
import { editProfileSchema as validationSchema } from '@/validation/editProfileSchema';

import FormWrapper from '@/components/FormWrapper';
import FormField from '@/components/FormField';
import InfoBox from '@/components/InfoBox';
import { CharacterCounter } from '@/components/CharacterCounter';
import PersonCard from '@/components/PersonCard';
import Button from '@/components/Button';
import { FiSave, FiUpload } from 'react-icons/fi';

function EditProfile() {
  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [infoBox, setInfoBox] = useState({ message: '', variant: 'info' });

  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  useRunOnce(() => {
    (async () => {
      const uid = await getCurrentUserId();
      if (!uid) return;

      setUserId(uid);

      const data = await getFullUserProfile(uid);
      if (!data) return;

      const hydratedProfile = {
        name: data.user?.name || '',
        age: data.age || null,
        bio: data.bio || '',
        adventurePreferences: data.adventure_preferences || [],
        skillLevel: data.skill_summary || '',
        profileImageUrl: data.profile_image_url || '',
      };

      setProfile(hydratedProfile);
      formRef.current?.reset(hydratedProfile);
    })();
  });

  const handleImageUpload = async () => {
    if (!selectedFile || !userId) return;

    const file = selectedFile;
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

    setIsUploading(true);

    const filePath = `user-${userId}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from('profile-photos')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: true,
        cacheControl: 'public, max-age=0, must-revalidate',
        metadata: { owner: userId },
      });

    if (uploadError) {
      console.error('Upload failed:', uploadError);
      setInfoBox({ message: 'Image upload failed.', variant: 'error' });
      setIsUploading(false);
      return;
    }

    const publicUrl = getPublicProfileImageUrl(userId, { bustCache: true });

    const { error: updateError } = await supabase.from('userprofile').upsert(
      {
        user_id: userId,
        profile_image_url: publicUrl,
      },
      { onConflict: 'user_id' }
    );

    if (updateError) {
      console.error('Error saving image URL to userprofile:', updateError);
      setInfoBox({ message: 'Image uploaded, but profile was not updated.', variant: 'error' });
    } else {
      setProfile((prev) => ({
        ...prev,
        profileImageUrl: publicUrl,
      }));

      setInfoBox({ message: 'Profile image uploaded successfully!', variant: 'success' });
    }

    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsUploading(false);
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

      if (error) {
        console.error(error);
      }

      setProfile((prev) => ({
        ...prev,
        bio: data.bio,
        adventurePreferences: data.adventurePreferences,
        skillLevel: data.skillLevel,
      }));

      setInfoBox({ message: 'Profile updated successfully!', variant: 'success' });
    } catch (err) {
      console.error('Save failed:', err);
      setInfoBox({ message: 'Failed to save profile.', variant: 'error' });
    }
  };

  if (!profile) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="w-full flex-grow bg-background text-foreground flex justify-center p-6 font-body">
      <div className="w-full max-w-5xl bg-white shadow-md rounded-lg p-8 my-8">
        {infoBox.message && (
          <InfoBox
            message={infoBox.message}
            variant={infoBox.variant}
            testId="edit-profile-infobox"
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="mb-8">
              <h4 className="font-bold text-base mb-2">Profile Photo</h4>
              <label htmlFor="profileImage" className="block font-medium mb-1">
                Upload (max 2MB, JPG or PNG)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg"
                id="profileImage"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setSelectedFile(file);
                }}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />

              <div className="mt-3 flex gap-4">
                <Button
                  label={
                    <span className="flex items-center justify-center gap-2">
                      <FiUpload className="transition-transform duration-200 group-hover:scale-110" />
                      Upload Photo
                    </span>
                  }
                  variant="primary"
                  onClick={handleImageUpload}
                  isLoading={isUploading}
                  disabled={!selectedFile}
                  className="group"
                />

                <Button
                  label="Clear"
                  variant="muted"
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                />
              </div>
            </div>

            <FormWrapper
              ref={formRef}
              validationSchema={validationSchema}
              onSubmit={handleSave}
              defaultValues={profile}
              submitLabel={null} // disables the internal button rendering
            >
              {({ register, errors, watch, isSubmitting }) => {
                const watchedBio = watch('bio');
                const watchedAdventures = watch('adventurePreferences') || [];
                const watchedSkill = watch('skillLevel');

                const isDirty =
                  watchedBio !== profile.bio ||
                  JSON.stringify(watchedAdventures) !==
                    JSON.stringify(profile.adventurePreferences) ||
                  watchedSkill !== profile.skillLevel;

                return (
                  <>
                    <FormField
                      label="Bio"
                      id="bio"
                      type="textarea"
                      placeholder="Tell us about yourself"
                      register={register}
                      errors={errors}
                    />
                    <CharacterCounter value={watchedBio} maxLength={500} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        label="Adventure Preferences"
                        id="adventurePreferences"
                        type="checkbox"
                        options={adventurePreferences.map(({ value, label }) => ({ value, label }))}
                        register={register}
                        errors={errors}
                      />

                      <FormField
                        label="Skill Level"
                        id="skillLevel"
                        type="radio"
                        options={skillLevels}
                        register={register}
                        errors={errors}
                      />
                    </div>

                    {/* Submit Button Override */}
                    <div className="pt-2">
                      <Button
                        label={
                          <span className="flex items-center justify-center gap-2">
                            <FiSave className="transition-transform duration-200 group-hover:scale-110" />
                            Save Changes
                          </span>
                        }
                        variant="primary"
                        type="submit"
                        disabled={!isDirty}
                        isLoading={isSubmitting}
                        className="mt-4 w-full group"
                      />
                    </div>
                  </>
                );
              }}
            </FormWrapper>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Live Preview</h3>
            <PersonCard
              name={profile.name}
              age={profile.age}
              bio={profile.bio}
              skillLevel={profile.skillLevel}
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
