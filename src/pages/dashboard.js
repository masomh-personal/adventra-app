import { useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '@/lib/supabaseClient';
import withAuth from '@/lib/withAuth';
import Button from '@/components/Button';
import InfoCard from '@/components/InfoCard';
import { FaUserEdit, FaSignOutAlt, FaEye, FaMap, FaComment } from 'react-icons/fa';

function Dashboard({ user }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const userFirstName = user?.user_metadata?.full_name.split(' ')[0];

  const handleLogout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      await router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    // Add profile edit logic here
    console.log('Edit Profile clicked');
    // Example: router.push('/profile/edit');
  };

  return (
    <div className="w-full flex-grow bg-background text-foreground flex items-center justify-center p-6 font-body">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-8 my-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-heading">Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button
              label="Edit Profile"
              onClick={handleEditProfile}
              variant="secondary"
              leftIcon={<FaUserEdit className="mr-0" />}
              data-testid="edit-profile-button"
            />
            <Button
              label={loading ? 'Logging out...' : 'Log Out'}
              onClick={handleLogout}
              disabled={loading}
              variant="red"
              leftIcon={<FaSignOutAlt className="mr-0" />}
              data-testid="log-out-button"
            />
          </div>
        </header>

        <hr className="border-t border-gray-300 mb-6" />

        <main>
          <h2 className="text-xl font-semibold mb-4 text-center">
            Welcome, {userFirstName}! Where does your next journey take you?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Your Matches Section */}
            <InfoCard
              title="Your Matches"
              description="View your matches and start planning your next adventure!"
              buttonLabel="Matches"
              buttonIcon={<FaEye className="mr-0" />}
              onClick={() => {
                /* Add view matches logic */
                console.log('View Matches clicked');
              }}
              testId="matches-infocard" // Added testId
            />

            {/* Find Adventures Section */}
            <InfoCard
              title="Find Adventurers"
              description="Start browsing other adventurers and plan your next journey!"
              buttonLabel="Adventurers"
              buttonIcon={<FaMap className="mr-0" />}
              onClick={() => {
                /* Add browse adventures logic */
                console.log('Browse Adventures clicked');
              }}
              testId="adventurers-infocard" // Added testId
            />

            {/* Messages Section */}
            <InfoCard
              title="Messages"
              description="View and reply to all your chat messages from other adventurers!"
              buttonLabel="Messages"
              buttonIcon={<FaComment className="mr-0" />}
              onClick={() => {
                /* Add view messages logic */
                console.log('View Messages clicked');
              }}
              testId="messages-infocard" // Added testId
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default withAuth(Dashboard);
