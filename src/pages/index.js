export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Header Section (Logo Above Welcome Text) */}
      {/*<header className="flex flex-col justify-center items-center p-6 space-y-4">*/}
      {/*  /!* Logo (adjusted size and centered) *!/*/}
      {/*  <img src="/adventra-logo.png" alt="Adventra Logo" className="h-28" />{' '}*/}
      {/*  /!* Adjusted logo size *!/*/}
      {/*</header>*/}

      {/* Main Content Section */}
      <main className="flex-1 flex flex-col justify-center items-center space-y-8 p-6 text-center">
        <img src="/adventra-logo.png" alt="Adventra Logo" className="h-28" />{' '}
        <h2 className="text-4xl font-[var(--font-heading)] font-bold text-center">
          Welcome to Adventra
        </h2>
        <p className="text-xl text-center">
          A social network for outdoor adventurers. Connect, share, and explore!
        </p>
        {/* Buttons for Login and Create Account (Stacked Vertically) */}
        <div className="flex flex-col space-y-2">
          {' '}
          {/* Reduced space-y for closer buttons */}
          <button className="btn">Create Account</button>
          <button className="btn bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white">
            Login
          </button>
        </div>
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
        <div className="text-center text-sm mt-4">
          <p>&copy; 2025 Adventra. All rights reserved.</p>
          <p className="mt-2">
            Made with <span className="text-red-500">❤️</span> from KSU
          </p>
        </div>
      </footer>
    </div>
  );
}
