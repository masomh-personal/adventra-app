export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 font-body">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h2 className="text-3xl font-heading text-center mb-2">🏕️ Login to Adventra</h2>
        <hr className="border-t border-gray-300 mb-6" />

        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block font-heading mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-heading mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <button
            type="submit"
            className="btn bg-primary text-white hover:bg-secondary w-full"
            onClick={(e) => {
              e.preventDefault();
              alert('Login attempted (placeholder)');
            }}
          >
            Login
          </button>

          <p className="text-center text-sm mt-4">
            Don’t have an account?{' '}
            <a href="/signup" className="text-primary hover:underline">
              Sign up here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
