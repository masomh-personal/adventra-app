import React, { useEffect, useState } from 'react';
import { getAllUserProfiles } from '@/lib/getAllUserProfiles';
import { getCurrentUserId } from '@/lib/getCurrentUserId';
import PersonCard from '@/components/PersonCard';
import Button from '@/components/Button';
import { MdClose } from 'react-icons/md';
import { FaComment, FaThumbsUp } from 'react-icons/fa';
import { useRouter } from 'next/router';
import LoadingSpinner from '@/components/LoadingSpinner';
import { calcAgeFromBirthdate } from '@/lib/calcAgeFromBirthdate';
import type { FullUserProfile } from '@/types/user';
import type { AdventurePreference, DatingPreference } from '@/types/index';

interface UserWithAge extends FullUserProfile {
    age?: number | null;
}

export default function SearchPage(): React.JSX.Element {
    const [users, setUsers] = useState<UserWithAge[]>([]);
    const [currentUserIndex, setCurrentUserIndex] = useState<number>(0);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

    const router = useRouter();

    // Fetch user profiles and the current user ID
    useEffect(() => {
        // IIFE to handle async call inside useEffect
        (async (): Promise<void> => {
            try {
                const [allUsers, userId] = await Promise.all([
                    getAllUserProfiles(),
                    getCurrentUserId(),
                ]);

                // Calculate age for each user and add it to the user object
                const usersWithAge: UserWithAge[] = allUsers.map(user => {
                    const age = user.birthdate ? calcAgeFromBirthdate(user.birthdate) : null;
                    return { ...user, age };
                });

                setUsers(usersWithAge);
                setCurrentUserId(userId);
            } catch (error) {
                console.error('Error fetching profiles or current user:', error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Handle swipe left (no match)
    const handleSwipeLeft = (): void => {
        setSwipeDirection('left');
        setTimeout(() => {
            setCurrentUserIndex(prevIndex => (prevIndex + 1) % users.length);
            setSwipeDirection(null);
        }, 300);
    };

    // Handle swipe right (match)
    const handleSwipeRight = (): void => {
        setSwipeDirection('right');
        setTimeout(() => {
            setCurrentUserIndex(prevIndex => (prevIndex + 1) % users.length);
            setSwipeDirection(null);
        }, 300);
    };

    // Exclude the current user from the list of users displayed
    const filteredUsers = users.filter(user => user.user_id !== currentUserId);

    if (loading)
        return (
            <div className="w-full h-screen flex items-center justify-center bg-background text-foreground">
                <LoadingSpinner label="Fetching profiles..." />
            </div>
        );

    // Get the current user data to pass to PersonCard
    const currentUser = filteredUsers[currentUserIndex];

    return (
        <div className="w-full flex items-center justify-center bg-background text-foreground p-4 font-body">
            {/* Wrapper for centering everything */}
            <div className="flex flex-col items-center justify-center space-y-4">
                {/* Yay/Nay Buttons */}
                <div className="flex justify-center gap-6">
                    <Button
                        onClick={handleSwipeLeft}
                        variant="danger"
                        label="No Match"
                        leftIcon={<MdClose />}
                    />
                    <Button
                        onClick={handleSwipeRight}
                        variant="green"
                        label="Interested"
                        leftIcon={<FaThumbsUp />}
                    />
                </div>

                {/* Person Card */}
                {currentUser && (
                    <PersonCard
                        key={currentUser.profile_image_url || currentUser.user_id}
                        name={currentUser.user?.name}
                        age={currentUser.age}
                        skillLevel={
                            currentUser.skill_summary
                                ? Object.keys(currentUser.skill_summary)[0]
                                : null
                        }
                        bio={currentUser.bio}
                        adventurePreferences={
                            (currentUser.adventure_preferences ||
                                []) as unknown as AdventurePreference[]
                        }
                        datingPreference={
                            ((currentUser.dating_preferences as string) ||
                                (null as unknown)) as DatingPreference | null
                        }
                        instagramUrl={currentUser.instagram_url}
                        facebookUrl={currentUser.facebook_url}
                        imgSrc={currentUser.profile_image_url}
                        swipeDirection={swipeDirection}
                    />
                )}

                {/* Message Button */}
                <div className="w-full">
                    <Button
                        label="Message"
                        onClick={async () => {
                            if (currentUser) {
                                await router.push(`./messages?userId=${currentUser.user_id}`);
                            }
                        }}
                        leftIcon={<FaComment className="mr-0" />}
                        variant="tertiary"
                        className="w-full"
                    />
                </div>
            </div>
        </div>
    );
}
