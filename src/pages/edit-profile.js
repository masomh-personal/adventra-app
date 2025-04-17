import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import supabase from '@/lib/supabaseClient';
import withAuth from '@/lib/withAuth';
import { getCurrentUserId } from '@/lib/getCurrentUserId';
import getPublicProfileImageUrl from '@/lib/getPublicProfileImageUrl';
import { getFullUserProfile } from '@/lib/getFullUserProfile';
import useRunOnce from '@/hooks/useRunOnce';
import { adventurePreferences, datingPreferences, skillLevels } from '@/lib/constants/userMeta';
import { editProfileSchema as validationSchema } from '@/validation/editProfileSchema';

import FormWrapper from '@/components/FormWrapper';
import FormField from '@/components/FormField';
import PersonCard from '@/components/PersonCard';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FiSave, FiUpload, FiArrowLeft, FiXCircle, FiFolder } from 'react-icons/fi';
import { useModal } from '@/contexts/ModalContext';

function EditProfile() {
  const router = useRouter();
  const { showErrorModal, showSuccessModal } = useModal();
  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

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
        datingPreferences: data.dating_preferences || '',
      };

      setProfile(hydratedProfile);
      setPreviewImageUrl(getPublicProfileImageUrl(uid, { bustCache: true }));
      formRef.current?.reset(hydratedProfile);
    })();
  });

  useEffect(() => {
    const timeout = setTimeout(() => setShowSpinner(true), 300);
    return () => clearTimeout(timeout);
  }, []);

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

    const cleanUrl = getPublicProfileImageUrl(userId);
    const bustedUrl = getPublicProfileImageUrl(userId, { bustCache: true });

    const { error: updateError } = await supabase.from('userprofile').upsert(
      {
        user_id: userId,
        profile_image_url: cleanUrl,
      },
      { onConflict: 'user_id' }
    );

    if (updateError) {
      console.error('Error saving image URL to userprofile:', updateError);
      showErrorModal('Image uploaded, but profile was not updated.', 'Save Error');
    } else {
      setProfile((prev) => ({ ...prev, profileImageUrl: cleanUrl }));
      setPreviewImageUrl(bustedUrl);
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
          dating_preferences: data.datingPreferences,
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
        datingPreferences: data.datingPreferences,
      }));

      showSuccessModal('Profile updated successfully!', 'Saved');
      formRef.current?.reset(data);
    } catch (err) {
      console.error('Save failed:', err);
      showErrorModal('Failed to save profile.', 'Save Error');
    }
  };

  if (!profile) {
    return showSpinner ? (
      <div className="flex-1 flex items-center justify-center w-full">
        <LoadingSpinner label="Fetching profile details..." />
      </div>
    ) : null;
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 font-body w-full">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 mx-auto">
        <FormWrapper
          ref={formRef}
          validationSchema={validationSchema}
          onSubmit={handleSave}
          onError={(errors) => {
            console.error('[FORM ERROR]', errors);
            showErrorModal('Form submission failed due to validation errors.', 'Validation Error');
          }}
          defaultValues={profile}
          submitLabel={null}
        >
          {({ register, errors, watch, isSubmitting, isValid }) => {
            const watchedBio = watch('bio');
            const watchedAdventures = watch('adventurePreferences') || [];
            const watchedSkill = watch('skillLevel');
            const watchedDatingPreference = watch('datingPreferences'); // Track dating preference

            const isDirty =
              watchedBio !== profile.bio ||
              JSON.stringify(watchedAdventures) !== JSON.stringify(profile.adventurePreferences) ||
              watchedSkill !== profile.skillLevel ||
              watchedDatingPreference !== profile.datingPreferences; // Include dating preferences

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  {/* Profile Image Upload */}
                  <div className="mb-4">
                    <h4 className="font-bold text-base mb-2">Profile Photo</h4>
                    <label htmlFor="profileImage" className="block font-medium mb-1">
                      Upload (max 2MB, JPG or PNG)
                    </label>

                    <div className="flex items-center gap-3">
                      <Button
                        label={
                          <span className="flex items-center justify-center gap-2">
                            {selectedFile ? (
                              <>
                                <FiUpload />
                                Upload Photo
                              </>
                            ) : (
                              <>
                                <FiFolder />
                                Choose File
                              </>
                            )}
                          </span>
                        }
                        variant={selectedFile ? 'primary' : 'tertiary'}
                        onClick={async () => {
                          if (selectedFile) await handleImageUpload();
                          else fileInputRef.current?.click();
                        }}
                        isLoading={isUploading}
                        loadingLabel="Uploading..."
                        disabled={isUploading}
                        className="group"
                        size="base"
                      />
                      <div className="flex items-center gap-1 max-w-[220px] truncate text-sm font-bold text-gray-700">
                        <span className="truncate">
                          {selectedFile ? selectedFile.name : 'No file chosen'}
                        </span>
                        {selectedFile && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFile(null);
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="text-gray-500 hover:text-red-600 transition"
                            title="Clear selected file"
                            aria-label="Clear selected file"
                          >
                            <FiXCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg"
                      id="profileImage"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    <FormField
                      label="Seeking"
                      id="adventurePreferences"
                      type="checkbox"
                      options={adventurePreferences.map(({ value, label }) => ({ value, label }))}
                      register={register}
                      errors={errors}
                    />

                    <FormField
                      label="Skill"
                      id="skillLevel"
                      type="radio"
                      options={skillLevels}
                      register={register}
                      errors={errors}
                    />

                    <FormField
                      label="Preference"
                      id="datingPreferences"
                      type="radio"
                      options={datingPreferences}
                      register={register}
                      errors={errors}
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      label={
                        <>
                          <FiSave />
                          Save Changes
                        </>
                      }
                      variant="primary"
                      type="submit"
                      disabled={!isDirty || !isValid}
                      isLoading={isSubmitting}
                      className="mt-4 w-full group"
                    />
                  </div>
                </div>

                <div className="w-full md:w-[320px] mx-auto space-y-4">
                  <h4 className="text-lg font-bold mb-2">Live Preview</h4>
                  <PersonCard
                    key={previewImageUrl}
                    name={profile.name}
                    age={profile.age}
                    bio={watchedBio}
                    skillLevel={watchedSkill}
                    adventurePreferences={watchedAdventures}
                    datingPreference={watchedDatingPreference}
                    imgSrc={previewImageUrl}
                    useNextImage={false}
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
            <>
              <FiArrowLeft className="text-sm" /> Back to Dashboard
            </>
          }
          variant="secondary"
          onClick={() => router.push('/dashboard')}
        />
      </div>
    </div>
  );
}

export default withAuth(EditProfile);
