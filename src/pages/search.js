import { useEffect, useState } from 'react';
import { getAllUserProfiles } from '@/lib/getAllUserProfiles'; // A function to get all user profiles
import { getCurrentUserId } from '@/lib/getCurrentUserId'; // Import the function to get the current user
import PersonCard from '@/components/PersonCard'; // Your provided PersonCard component
import Button from '@/components/Button'; // Custom Button component
import { MdClose } from 'react-icons/md'; // Import Close (X) icon
import { FaThumbsUp } from 'react-icons/fa'; // Import Thumbs Up icon
import { useRouter } from 'next/router';
import LoadingSpinner from '@/components/LoadingSpinner'; // Import the LoadingSpinner component

export default function SearchPage() {
  const [users, setUsers] = useState([]); // List of all user profiles
  const [currentUserIndex, setCurrentUserIndex] = useState(0); // Index of the current user to display
  const [currentUserId, setCurrentUserId] = useState(null); // Store the current user ID
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Fetch user profiles and the current user ID
  useEffect(() => {
    // IIFE to handle async call inside useEffect
    (async () => {
      try {
        const [allUsers, userId] = await Promise.all([
          getAllUserProfiles(), // Fetch all user profiles
          getCurrentUserId(), // Get the current logged-in user ID
        ]);
        setUsers(allUsers);
        setCurrentUserId(userId); // Set the current user's ID
      } catch (error) {
        console.error('Error fetching profiles or current user:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Handle swipe left (no match)
  const handleSwipeLeft = () => {
    setCurrentUserIndex((prevIndex) => (prevIndex + 1) % users.length); // Move to next user
  };

  // Handle swipe right (match)
  const handleSwipeRight = () => {
    // Match logic could be implemented here (e.g., updating a "matches" table in the database)
    setCurrentUserIndex((prevIndex) => (prevIndex + 1) % users.length); // Move to next user
  };

  // Exclude the current user from the list of users displayed
  const filteredUsers = users.filter((user) => user.user_id !== currentUserId);

  if (loading)
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background text-foreground">
        <LoadingSpinner label="Fetching profiles..." />
      </div>
    );

  // Get the current user data to pass to PersonCard
  const currentUser = filteredUsers[currentUserIndex] || {};

  return (
    <div className="w-full flex items-center justify-center bg-background text-foreground p-6 font-body">
      {/* Wrapper for centering everything */}
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Person Card */}
        {currentUser && (
          <PersonCard
            key={currentUser.profile_image_url} // Use the image URL as the key to force re-render
            name={currentUser.user?.name}
            age={currentUser.age}
            skillLevel={currentUser.skill_summary}
            bio={currentUser.bio}
            adventurePreferences={currentUser.adventure_preferences}
            datingPreference={currentUser.dating_preferences}
            instagramUrl={currentUser.instagram_url}
            facebookUrl={currentUser.facebook_url}
            imgSrc={currentUser.profile_image_url}
          />
        )}

        {/* Buttons */}
        <div className="flex justify-center gap-6">
          <Button
            onClick={handleSwipeLeft}
            variant="danger"
            label="No Match"
            leftIcon={<MdClose />} // Pass MdClose icon for "No Match"
          />
          <Button
            onClick={handleSwipeRight}
            variant="green"
            label="Interested"
            leftIcon={<FaThumbsUp />} // Pass FaThumbsUp icon for "Interested"
          />
        </div>
      </div>
    </div>
  );
}
