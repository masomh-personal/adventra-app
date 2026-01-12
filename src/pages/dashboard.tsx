import React, { useState } from 'react';
import { useRouter } from 'next/router';
import type { Models } from 'appwrite';
import { account } from '@/lib/appwriteClient';
import withAuth from '@/lib/withAuth';
import Button from '@/components/Button';
import InfoCard from '@/components/InfoCard';
import { FaUserEdit, FaSignOutAlt, FaMap, FaComment } from 'react-icons/fa';

interface DashboardProps {
    user: Models.User<Models.Preferences> | null;
}

function Dashboard({ user }: DashboardProps): React.JSX.Element {
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const userFirstName = user?.name?.split(' ')[0] || 'User';

    const handleLogout = async (): Promise<void> => {
        try {
            setLoading(true);
            await account.deleteSession('current');
            await router.push('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditProfile = async (): Promise<void> => {
        await router.push('/edit-profile');
    };

    return (
        <div className='w-full flex-grow bg-background text-foreground flex items-center justify-center p-6 font-body'>
            <div className='w-full max-w-3xl bg-white shadow-md rounded-lg p-8 my-8'>
                <main>
                    <h2 className='text-xl font-extrabold mb-4 text-center'>
                        Welcome, <span className='text-secondary'>{userFirstName}</span>!
                    </h2>
                    <h3 className='text-xl font-extrabold mb-4 text-center'>
                        Start planning your next adventure with someone new
                    </h3>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-8'>
                        <InfoCard
                            icon={<FaMap className='text-4xl text-primary' />}
                            title='Find Adventurers'
                            description='Discover and match with like-minded outdoor enthusiasts'
                            button={
                                <Button
                                    label='Start Matching'
                                    onClick={() => router.push('/search')}
                                    variant='primary'
                                    size='base'
                                    aria-label='Go to search page'
                                    testId='start-matching-button'
                                />
                            }
                        />

                        <InfoCard
                            icon={<FaComment className='text-4xl text-primary' />}
                            title='Messages'
                            description='Chat with your matched adventurers'
                            button={
                                <Button
                                    label='View Messages'
                                    onClick={() => router.push('/messages')}
                                    variant='primary'
                                    size='base'
                                    aria-label='Go to messages page'
                                    testId='view-messages-button'
                                />
                            }
                        />

                        <InfoCard
                            icon={<FaUserEdit className='text-4xl text-primary' />}
                            title='Edit Profile'
                            description='Update your profile information and preferences'
                            button={
                                <Button
                                    label='Edit Profile'
                                    onClick={handleEditProfile}
                                    variant='secondary'
                                    size='base'
                                    aria-label='Go to edit profile page'
                                    testId='edit-profile-button'
                                />
                            }
                        />

                        <InfoCard
                            icon={<FaSignOutAlt className='text-4xl text-primary' />}
                            title='Logout'
                            description='Sign out of your account'
                            button={
                                <Button
                                    label={loading ? 'Logging out...' : 'Logout'}
                                    onClick={handleLogout}
                                    variant='tertiary'
                                    size='base'
                                    disabled={loading}
                                    aria-label='Log out of account'
                                    testId='logout-button'
                                />
                            }
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default withAuth(Dashboard);
