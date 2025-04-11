import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
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
import PersonCard from '@/components/PersonCard';
import Button from '@/components/Button';
import { FiSave, FiUpload } from 'react-icons/fi';

function EditProfile() {
  const router = useRouter();
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
      if (!uid) {
        setInfoBox({ message: 'Unable to detect user session.', variant: 'error' });
        return;
      }

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
    if (!selectedFile || !userId) {
      setInfoBox({ message: 'Please select a photo first.', variant: 'error' });
      return;
    }

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
    if (!userId) {
      setInfoBox({ message: 'Unable to detect user session.', variant: 'error' });
      return;
    }

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
        setInfoBox({ message: 'Failed to save profile.', variant: 'error' });
        return;
      }

      setProfile((prev) => ({
        ...prev,
        bio: data.bio,
        adventurePreferences: data.adventurePreferences,
        skillLevel: data.skillLevel,
      }));

      setInfoBox({ message: 'Profile updated successfully!', variant: 'success' });
      formRef.current?.reset(data);
    } catch (err) {
      console.error('Save failed:', err);
      setInfoBox({ message: 'Failed to save profile.', variant: 'error' });
    }
  };

  if (!profile) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="w-full flex-grow bg-background text-foreground flex justify-center p-2 font-body">
      <div className="w-full max-w-5xl bg-white shadow-md rounded-lg p-4 my-8">
        {infoBox.message && (
          <InfoBox
            message={infoBox.message}
            variant={infoBox.variant}
            testId="edit-profile-infobox"
          />
        )}

        <FormWrapper
          ref={formRef}
          validationSchema={validationSchema}
          onSubmit={handleSave}
          onError={() =>
            setInfoBox({
              message: 'Form submission failed due to validation errors.',
              variant: 'error',
            })
          }
          defaultValues={profile}
          submitLabel={null}
        >
          {({ register, errors, watch, isSubmitting }) => {
            const watchedBio = watch('bio');
            const watchedAdventures = watch('adventurePreferences') || [];
            const watchedSkill = watch('skillLevel');

            const isDirty =
              watchedBio !== profile.bio ||
              JSON.stringify(watchedAdventures) !== JSON.stringify(profile.adventurePreferences) ||
              watchedSkill !== profile.skillLevel;

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="mb-8">
                    <h4 className="font-bold text-base mb-2">Profile Photo</h4>
                    <label htmlFor="profileImage" className="block font-medium mb-1">
                      Upload (max 2MB, JPG or PNG)
                    </label>

                    <div className="flex items-center gap-4">
                      <label
                        htmlFor="profileImage"
                        className="cursor-pointer inline-flex items-center justify-center px-5 py-2 rounded-xl font-semibold text-sm text-white bg-secondary hover:bg-primary transition-all border border-gray-300 shadow-sm"
                      >
                        Choose File
                      </label>

                      <span className="text-sm text-gray-700 truncate max-w-[220px]">
                        {selectedFile ? selectedFile.name : 'No file chosen'}
                      </span>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg"
                      id="profileImage"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setSelectedFile(file);
                      }}
                      className="hidden"
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

                  <hr className="my-6 border-t border-gray-300" />

                  <FormField
                    label="Bio"
                    id="bio"
                    type="textarea"
                    register={register}
                    errors={errors}
                    placeholder="Tell us about yourself"
                    maxHeight="max-h-48"
                    characterCountOptions={{
                      value: watchedBio,
                      maxLength: 500,
                    }}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
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

                  <div className="pt-4">
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

                  <div className="mt-8 text-center">
                    <Button
                      label="Back to Dashboard"
                      variant="outline"
                      onClick={() => router.push('/dashboard')}
                      className="mx-auto"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold mb-2">Live Preview</h4>
                  <PersonCard
                    name={profile.name}
                    age={profile.age}
                    bio={watchedBio}
                    skillLevel={watchedSkill}
                    adventurePreferences={watchedAdventures}
                    imgSrc={profile.profileImageUrl}
                  />
                </div>
              </div>
            );
          }}
        </FormWrapper>
      </div>
    </div>
  );
}

export default withAuth(EditProfile);
