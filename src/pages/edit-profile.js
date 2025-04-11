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
import PersonCard from '@/components/PersonCard';
import Button from '@/components/Button';
import { FiSave, FiUpload, FiArrowLeft } from 'react-icons/fi';
import { useModal } from '@/contexts/ModalContext';

function EditProfile() {
  const router = useRouter();
  const { showErrorModal, showSuccessModal } = useModal();
  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  useRunOnce(() => {
    (async () => {
      const uid = await getCurrentUserId();
      if (!uid) {
        showErrorModal('Unable to detect user session.', 'Session Error');
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
      showErrorModal('Please select a photo first.', 'Missing File');
      return;
    }

    const file = selectedFile;
    const maxSize = 2 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/png'];

    if (!allowedTypes.includes(file.type)) {
      showErrorModal('Only PNG or JPEG images allowed.', 'Invalid Format');
      return;
    }

    if (file.size > maxSize) {
      showErrorModal('Image must be under 2MB.', 'File Too Large');
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
      showErrorModal('Image upload failed.', 'Upload Error');
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
      showErrorModal('Image uploaded, but profile was not updated.', 'Save Error');
    } else {
      setProfile((prev) => ({
        ...prev,
        profileImageUrl: publicUrl,
      }));
      showSuccessModal('Profile image uploaded successfully!', 'Upload Successful');
    }

    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsUploading(false);
  };

  const handleSave = async (data) => {
    if (!userId) {
      showErrorModal('Unable to detect user session.', 'Session Error');
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
        showErrorModal('Failed to save profile.', 'Save Error');
        return;
      }

      setProfile((prev) => ({
        ...prev,
        bio: data.bio,
        adventurePreferences: data.adventurePreferences,
        skillLevel: data.skillLevel,
      }));

      showSuccessModal('Profile updated successfully!', 'Saved');
      formRef.current?.reset(data);
    } catch (err) {
      console.error('Save failed:', err);
      showErrorModal('Failed to save profile.', 'Save Error');
    }
  };

  if (!profile) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen p-4 font-body">
      <div className="w-full max-w-[53rem] bg-white shadow-md rounded-lg p-6 mx-auto">
        <FormWrapper
          ref={formRef}
          validationSchema={validationSchema}
          onSubmit={handleSave}
          onError={() =>
            showErrorModal('Form submission failed due to validation errors.', 'Validation Error')
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
                  <div className="mb-4">
                    <h4 className="font-bold text-base mb-2">Profile Photo</h4>
                    <label htmlFor="profileImage" className="block font-medium mb-1">
                      Upload (max 2MB, JPG or PNG)
                    </label>

                    <div className="flex items-center gap-4">
                      <label
                        htmlFor="profileImage"
                        className="cursor-pointer inline-flex items-center justify-center px-3 py-1 rounded-md font-semibold text-sm text-white bg-secondary hover:bg-primary transition-all border border-gray-300 shadow-sm"
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

      <div className="mt-4 mx-auto">
        <Button
          label={
            <span className="flex items-center justify-center gap-2">
              <FiArrowLeft className="text-sm" />
              Back to Dashboard
            </span>
          }
          variant="secondary"
          onClick={() => router.push('/dashboard')}
        />
      </div>
    </div>
  );
}

export default withAuth(EditProfile);
