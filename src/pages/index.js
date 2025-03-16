export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Header Section */}
      <header className="flex items-center justify-center p-4">
        {' '}
        {/* Reduced padding */}
        <div className="flex items-center space-x-4">
          {/* Logo (now loading from public directory) */}
          <img src="/adventra-logo.png" alt="Adventra Logo" className="h-16" />{' '}
          {/* Adjusted logo size */}
        </div>
      </header>

      {/* Main Content Section */}
      <main className="flex-1 flex flex-col justify-center items-center space-y-8 p-6 text-center">
        <h2 className="text-4xl font-[var(--font-heading)] text-center">Welcome to Adventra</h2>
        <p className="text-xl text-center">
          A social network for outdoor adventurers. Connect, share, and explore!
        </p>

        {/* Buttons for Login and Create Account */}
        <div className="flex space-x-4">
          <button className="btn mt-8">Create Account</button>
          <button className="btn mt-8 bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white">
            Login
          </button>
        </div>

        <h1 className="text-3xl font-bold underline">Hello world!</h1>
      </main>

      {/* Footer Section */}
      <footer className="bg-primary text-white py-4 mt-8">
        <div className="flex justify-center space-x-8">
          <a href="/about" className="hover:text-secondary">
            About
          </a>
          <a href="/privacy-policy" className="hover:text-secondary">
            Privacy Policy
          </a>
          <a href="/contact" className="hover:text-secondary">
            Contact
          </a>
        </div>
        <div className="text-center mt-4">
          <p>&copy; 2025 Adventra. All rights reserved.</p>
        </div>
        <h1 className="text-3xl font-bold underline">Hello, Next.js!</h1>
      </footer>
    </div>
  );
}
