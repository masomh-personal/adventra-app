import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import type { Models } from 'appwrite';
import withAuth from '@/lib/withAuth';
import { getCurrentUserId } from '@/lib/getCurrentUserId';
import getPublicProfileImageUrl from '@/lib/getPublicProfileImageUrl';
import { getFullUserProfile } from '@/lib/getFullUserProfile';
import useRunOnce from '@/hooks/useRunOnce';
import { adventurePreferences, datingPreferences, skillLevels } from '@/lib/constants/userMeta';
import { editProfileSchema as validationSchema } from '@/validation/editProfileSchema';

import FormWrapper, { type FormWrapperRef, type FormContext } from '@/components/FormWrapper';
import FormField from '@/components/FormField';
import PersonCard from '@/components/PersonCard';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FiSave, FiUpload, FiArrowLeft, FiXCircle, FiFolder, FiTrash2 } from 'react-icons/fi';
import { useModal } from '@/contexts/ModalContext';
import type { EditProfileFormData } from '@/types/form';
import type { AdventurePreference, DatingPreference } from '@/types/index';

interface ProfileData {
    name: string;
    age: number | null;
    bio: string;
    adventurePreferences: string[];
    skillLevel: string;
    profileImageUrl: string;
    datingPreferences: string;
    instagramUrl: string;
    facebookUrl: string;
}

interface EditProfileProps {
    user: Models.User<Models.Preferences> | null;
}

function EditProfile({ user: _user }: EditProfileProps): React.JSX.Element {
    const router = useRouter();
    const { showConfirmationModal, showErrorModal, showSuccessModal } = useModal();

    /* ---------- local state ---------- */
    const [userId, setUserId] = useState<string | null>(null);
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [previewImageUrl, setPreviewImageUrl] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [showSpinner, setShowSpinner] = useState<boolean>(false);

    /* ---------- refs ---------- */
    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<FormWrapperRef>(null);

    /* ---------- initial fetch ---------- */
    useRunOnce(() => {
        (async (): Promise<void> => {
            const uid = await getCurrentUserId();
            if (!uid) {
                showErrorModal('Unable to detect user session.', 'Session Error');
                return;
            }

            setUserId(uid);

            const data = await getFullUserProfile(uid);
            if (!data) return;

            const hydrated: ProfileData = {
                name: data.user?.name || '',
                age: data.age || null,
                bio: data.bio || '',
                adventurePreferences: (data.adventure_preferences as string[]) || [],
                skillLevel: data.skill_summary ? JSON.stringify(data.skill_summary) : '',
                profileImageUrl: data.profile_image_url || '',
                datingPreferences: data.dating_preferences || '',
                instagramUrl: data.instagram_url || '',
                facebookUrl: data.facebook_url || '',
            };

            setProfile(hydrated);
            setPreviewImageUrl(getPublicProfileImageUrl(uid, { bustCache: true }));
            formRef.current?.reset();
        })();
    });

    /* ---------- small spinner delay ---------- */
    useEffect(() => {
        const t = setTimeout(() => setShowSpinner(true), 300);
        return () => clearTimeout(t);
    }, []);

    /* ---------- helpers ---------- */
    const handleImageUpload = async (): Promise<void> => {
        if (!selectedFile || !userId) return;

        const file = selectedFile;
        const maxSize = 2 * 1024 * 1024;
        const okTypes = ['image/jpeg', 'image/png'];

        if (!okTypes.includes(file.type)) {
            showErrorModal('Only PNG or JPEG images allowed.', 'Invalid Format');
            return;
        }
        if (file.size > maxSize) {
            showErrorModal('Image must be under 2MB.', 'File Too Large');
            return;
        }

        setIsUploading(true);
        const filePath = `user-${userId}.jpg`;

        const { error: uploadErr } = await supabase.storage
            .from('profile-photos')
            .upload(filePath, file, {
                contentType: file.type,
                upsert: true,
                cacheControl: 'public, max-age=0, must-revalidate',
                metadata: { owner: userId },
            });

        if (uploadErr) {
            console.error(uploadErr);
            showErrorModal('Image upload failed.', 'Upload Error');
            setIsUploading(false);
            return;
        }

        const cleanUrl = getPublicProfileImageUrl(userId);
        const busted = getPublicProfileImageUrl(userId, { bustCache: true });

        const { error: dbErr } = await (supabase.from('userprofile') as any).upsert(
            { user_id: userId, profile_image_url: cleanUrl },
            { onConflict: 'user_id' },
        );

        if (dbErr) {
            console.error(dbErr);
            showErrorModal('Image uploaded, but DB update failed.', 'Save Error');
        } else {
            setProfile(p => (p ? { ...p, profileImageUrl: cleanUrl } : null));
            setPreviewImageUrl(busted);
            showSuccessModal('Profile image uploaded successfully!', 'Upload OK');
        }

        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setIsUploading(false);
    };

    const handleSave = async (formData: EditProfileFormData): Promise<void> => {
        if (!userId) {
            showErrorModal('Session not found.', 'Session Error');
            return;
        }

        try {
            if (selectedFile) {
                await handleImageUpload();
            }

            const { error } = await (supabase.from('userprofile') as any).upsert(
                {
                    user_id: userId,
                    bio: formData.bio,
                    adventure_preferences: formData.adventurePreferences as string[],
                    skill_summary: formData.skillLevel
                        ? (() => {
                              try {
                                  return JSON.parse(formData.skillLevel);
                              } catch {
                                  // If it's not JSON, it's likely a plain string value from radio button
                                  return formData.skillLevel;
                              }
                          })()
                        : null,
                    profile_image_url: profile?.profileImageUrl,
                    dating_preferences: formData.datingPreferences,
                    instagram_url: formData.instagramUrl,
                    facebook_url: formData.facebookUrl,
                },
                { onConflict: 'user_id' },
            );

            if (error) {
                console.error(error);
                showErrorModal('Failed to save profile.', 'Save Error');
                return;
            }

            setProfile(p =>
                p
                    ? {
                          ...p,
                          bio: formData.bio || '',
                          adventurePreferences: (formData.adventurePreferences as string[]) || [],
                          skillLevel: formData.skillLevel || '',
                          datingPreferences: formData.datingPreferences || '',
                          instagramUrl: formData.instagramUrl || '',
                          facebookUrl: formData.facebookUrl || '',
                      }
                    : (null as ProfileData | null),
            );

            showSuccessModal('Profile updated successfully!', 'Saved');
            formRef.current?.reset();
        } catch (err) {
            console.error(err);
            showErrorModal('Failed to save profile.', 'Save Error');
        }
    };

    /* ---------- delete profile ---------- */
    const handleDeleteProfile = async (): Promise<void> => {
        const ok = await showConfirmationModal(
            'Are you sure you want to delete your profile? This cannot be undone.',
            'Delete Profile',
        );
        if (!ok) return;

        try {
            const res = await fetch('/api/delete-profile', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });
            const payload = await res.json();
            if (!res.ok) throw new Error((payload as { error?: string }).error || 'Delete failed');

            await supabase.auth.signOut();
            showSuccessModal('Profile deleted.', 'Done', () => router.push('/'));
        } catch (err) {
            console.error(err);
            showErrorModal('Delete failed.', 'Error');
        }
    };

    /* ---------- early loading ---------- */
    if (!profile) {
        return showSpinner ? (
            <div className='flex-1 flex items-center justify-center w-full'>
                <LoadingSpinner label='Fetching profile...' />
            </div>
        ) : (
            <React.Fragment />
        );
    }

    /* ---------- UI ---------- */
    return (
        <div className='flex-1 flex flex-col items-center justify-center p-4 font-body w-full'>
            <div className='w-full max-w-4xl bg-white shadow-md rounded-md p-6 mx-auto'>
                <FormWrapper
                    ref={formRef}
                    validationSchema={validationSchema}
                    onSubmit={handleSave}
                    defaultValues={profile}
                    submitLabel=''
                    onError={e => {
                        console.error('[FORM]', e);
                        showErrorModal('Validation errors; please check fields.', 'Invalid');
                    }}
                >
                    {(formContext: FormContext) => {
                        const { register, errors, watch, isSubmitting, isValid } = formContext;
                        /* ----- watched form values ----- */
                        const b = String(watch('bio') || '');
                        const adv = (watch('adventurePreferences') as string[]) || [];
                        const skl = String(watch('skillLevel') || '');
                        const dat = String(watch('datingPreferences') || '');
                        const ig = String(watch('instagramUrl') || '');
                        const fb = String(watch('facebookUrl') || '');

                        /* ----- dirty check ----- */
                        const isDirty =
                            selectedFile !== null ||
                            b !== profile.bio ||
                            JSON.stringify(adv) !== JSON.stringify(profile.adventurePreferences) ||
                            skl !== profile.skillLevel ||
                            dat !== profile.datingPreferences ||
                            ig !== profile.instagramUrl ||
                            fb !== profile.facebookUrl;

                        return (
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-1'>
                                {/* -------- left column -------- */}
                                <div>
                                    {/* photo uploader */}
                                    <div className='mb-4'>
                                        <h4 className='font-bold text-base mb-2'>Profile Photo</h4>
                                        <label
                                            className='block font-medium mb-1'
                                            htmlFor='file-upload'
                                        >
                                            Upload (max 2 MB, JPG/PNG)
                                        </label>

                                        <div className='flex items-center gap-3'>
                                            <Button
                                                label={
                                                    (
                                                        <span className='flex items-center gap-2'>
                                                            {selectedFile ? (
                                                                <>
                                                                    <FiUpload /> Upload Photo
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FiFolder /> Choose File
                                                                </>
                                                            )}
                                                        </span>
                                                    ) as unknown as string
                                                }
                                                variant={selectedFile ? 'primary' : 'tertiary'}
                                                onClick={async () => {
                                                    if (selectedFile) await handleImageUpload();
                                                    else fileInputRef.current?.click();
                                                }}
                                                isLoading={isUploading}
                                                loadingLabel='Uploading...'
                                                disabled={isUploading}
                                                size='base'
                                            />
                                            <div className='flex items-center gap-1 max-w-[220px] truncate text-sm font-bold text-gray-700'>
                                                <span className='truncate'>
                                                    {selectedFile
                                                        ? selectedFile.name
                                                        : 'No file chosen'}
                                                </span>
                                                {selectedFile && (
                                                    <button
                                                        type='button'
                                                        onClick={() => {
                                                            setSelectedFile(null);
                                                            if (fileInputRef.current)
                                                                fileInputRef.current.value = '';
                                                        }}
                                                        className='text-gray-500 hover:text-red-600'
                                                        aria-label='Clear file'
                                                    >
                                                        <FiXCircle className='w-4 h-4' />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <input
                                            id='file-upload'
                                            ref={fileInputRef}
                                            type='file'
                                            accept='image/png,image/jpeg'
                                            onChange={e =>
                                                setSelectedFile(e.target.files?.[0] || null)
                                            }
                                            className='hidden'
                                        />
                                    </div>

                                    {/* bio */}
                                    <FormField
                                        label='Bio'
                                        id='bio'
                                        type='textarea'
                                        register={register}
                                        errors={errors}
                                        placeholder='Tell us about yourself'
                                        maxHeight='max-h-48'
                                        characterCountOptions={{ value: b, maxLength: 500 }}
                                    />

                                    {/* preferences */}
                                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-4'>
                                        <FormField
                                            label='Seeking'
                                            id='adventurePreferences'
                                            type='checkbox'
                                            options={adventurePreferences.map(
                                                ({ value, label }) => ({
                                                    value,
                                                    label,
                                                }),
                                            )}
                                            register={register}
                                            errors={errors}
                                        />

                                        <FormField
                                            label='Skill'
                                            id='skillLevel'
                                            type='radio'
                                            options={skillLevels}
                                            register={register}
                                            errors={errors}
                                        />

                                        <FormField
                                            label='Preference'
                                            id='datingPreferences'
                                            type='radio'
                                            options={datingPreferences.map(({ value, label }) => ({
                                                value,
                                                label,
                                            }))}
                                            register={register}
                                            errors={errors}
                                        />
                                    </div>

                                    {/* socials */}
                                    <div className='grid grid-cols-1 gap-2 mt-4'>
                                        <FormField
                                            label='Instagram URL'
                                            id='instagramUrl'
                                            type='text'
                                            register={register}
                                            errors={errors}
                                            placeholder='https://instagram.com/yourprofile'
                                        />
                                        <FormField
                                            label='Facebook URL'
                                            id='facebookUrl'
                                            type='text'
                                            register={register}
                                            errors={errors}
                                            placeholder='https://facebook.com/yourprofile'
                                        />
                                    </div>

                                    {/* save */}
                                    <div className='pt-4'>
                                        <Button
                                            label={
                                                (
                                                    <>
                                                        <FiSave /> Save Changes
                                                    </>
                                                ) as unknown as string
                                            }
                                            variant='primary'
                                            type='submit'
                                            disabled={!isDirty || !isValid || isUploading}
                                            isLoading={isSubmitting}
                                            className='w-full'
                                        />
                                    </div>
                                </div>

                                {/* -------- live preview -------- */}
                                <div className='w-full md:w-[320px] mx-auto space-y-4'>
                                    <h4 className='text-lg font-bold text-center'>Live Preview</h4>
                                    <PersonCard
                                        key={previewImageUrl}
                                        name={profile.name}
                                        age={profile.age}
                                        bio={b}
                                        skillLevel={
                                            skl
                                                ? (() => {
                                                      try {
                                                          return JSON.parse(skl);
                                                      } catch {
                                                          // If it's not JSON, it's likely a plain string value from radio button
                                                          return skl;
                                                      }
                                                  })()
                                                : null
                                        }
                                        adventurePreferences={
                                            adv as unknown as AdventurePreference[]
                                        }
                                        datingPreference={dat as unknown as DatingPreference | null}
                                        instagramUrl={ig || undefined}
                                        facebookUrl={fb || undefined}
                                        imgSrc={previewImageUrl || undefined}
                                        useNextImage={false}
                                    />
                                </div>
                            </div>
                        );
                    }}
                </FormWrapper>
            </div>

            {/* -------- bottom buttons -------- */}
            <div className='mt-4 flex gap-4'>
                <Button
                    label={
                        (
                            <>
                                <FiArrowLeft className='text-sm' /> Back to Dashboard
                            </>
                        ) as unknown as string
                    }
                    variant='secondary'
                    onClick={() => router.push('/dashboard')}
                />

                <Button
                    label={
                        (
                            <>
                                <FiTrash2 className='text-sm' /> Delete Profile
                            </>
                        ) as unknown as string
                    }
                    variant='danger'
                    onClick={handleDeleteProfile}
                />
            </div>
        </div>
    );
}

export default withAuth(EditProfile);
