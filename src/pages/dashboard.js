import { useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '@/lib/supabaseClient';
import withAuth from '@/lib/withAuth';

function Dashboard({ user }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  return (
    <div className="w-full flex-grow bg-background text-foreground flex items-center justify-center p-6 font-body">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-8 my-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-heading">🏕️ Adventra Dashboard</h1>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-70"
          >
            {loading ? 'Logging out...' : 'Log Out'}
          </button>
        </header>

        <hr className="border-t border-gray-300 mb-6" />

        <main>
          <h2 className="text-xl font-semibold mb-4 text-center">Welcome, {user?.email}!</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-gray-50 p-6 rounded-md text-center">
              <h3 className="text-lg font-medium mb-2">Your Profile</h3>
              <p className="text-gray-600 mb-4">Complete your profile to get better matches!</p>
              <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
                Edit Profile
              </button>
            </div>

            <div className="bg-gray-50 p-6 rounded-md text-center">
              <h3 className="text-lg font-medium mb-2">Find Adventures</h3>
              <p className="text-gray-600 mb-4">Start matching with adventure partners!</p>
              <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
                Browse Adventures
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default withAuth(Dashboard);
