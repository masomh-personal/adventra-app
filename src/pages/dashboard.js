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
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">🏕️ Adventra Dashboard</h1>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-70"
          >
            {loading ? 'Logging out...' : 'Log Out'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Welcome, {user?.email}!</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-gray-50 p-6 rounded-md">
                <h3 className="text-lg font-medium mb-2">Your Profile</h3>
                <p className="text-gray-600 mb-4">Complete your profile to get better matches!</p>
                <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
                  Edit Profile
                </button>
              </div>

              <div className="bg-gray-50 p-6 rounded-md">
                <h3 className="text-lg font-medium mb-2">Find Adventures</h3>
                <p className="text-gray-600 mb-4">Start matching with adventure partners!</p>
                <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
                  Browse Adventures
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default withAuth(Dashboard);
