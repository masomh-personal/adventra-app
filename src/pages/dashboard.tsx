import React, { useState } from 'react';
import { useRouter } from 'next/router';
import type { User } from '@supabase/supabase-js';
import supabase from '@/lib/supabaseClient';
import withAuth from '@/lib/withAuth';
import Button from '@/components/Button';
import InfoCard from '@/components/InfoCard';
import { FaUserEdit, FaSignOutAlt, FaMap, FaComment } from 'react-icons/fa';

interface DashboardProps {
  user: User | null;
}

function Dashboard({ user }: DashboardProps): React.JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const userFirstName = user?.user_metadata?.full_name?.split(' ')[0] || 'User';

  const handleLogout = async (): Promise<void> => {
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

  const handleEditProfile = async (): Promise<void> => {
    await router.push('/edit-profile');
  };

  return (
    <div className="w-full flex-grow bg-background text-foreground flex items-center justify-center p-6 font-body">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-8 my-8">
        <main>
          <h2 className="text-xl font-extrabold mb-4 text-center">
            Welcome, <span className="text-secondary">{userFirstName}</span>!
          </h2>
          <h3 className="text-xl font-extrabold mb-4 text-center">
            Start planning your next adventure with someone new
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Find Adventures Section */}
            <InfoCard
              title="Find Adventurers"
              description="Start browsing other adventurers and plan your next journey!"
              buttonLabel="Search"
              buttonIcon={<FaMap className="mr-0" />}
              buttonVariant="green"
              onClick={async () => {
                await router.push('/search');
              }}
              testId="adventurers-infocard"
            />

            {/* Messages Section */}
            <InfoCard
              title="Messages"
              description="View and reply to all your chat messages from other adventurers!"
              buttonLabel="Inbox"
              buttonIcon={<FaComment className="mr-0" />}
              buttonVariant="tertiary"
              onClick={async () => {
                await router.push('/messages');
              }}
              testId="messages-infocard"
            />
          </div>
        </main>
        <hr className="border-t border-gray-300 my-4" />
        <div className="flex flex-col md:flex-row md:justify-center items-center gap-4">
          <Button
            label="Edit Profile"
            onClick={handleEditProfile}
            variant="secondary"
            leftIcon={<FaUserEdit className="mr-0" />}
            data-testid="edit-profile-button"
            className="w-full md:w-auto"
          />
          <Button
            label={loading ? 'Logging out...' : 'Log Out'}
            onClick={handleLogout}
            disabled={loading}
            variant="danger"
            leftIcon={<FaSignOutAlt className="mr-0" />}
            data-testid="log-out-button"
            className="w-full md:w-auto"
          />
        </div>
      </div>
    </div>
  );
}

export default withAuth(Dashboard);
