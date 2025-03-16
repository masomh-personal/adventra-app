export default function HomePage() {
  return (
    <div className="min-h-screen text-foreground flex flex-col justify-between">
      {/* Video Background (or GIF background) */}
      <div className="absolute top-0 left-0 w-full h-full z-[-1]">
        <video autoPlay muted className="w-full h-full object-cover">
          <source src="/media/hiking.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Header Section (Logo Above Welcome Text) */}
      <header className="flex flex-col justify-center items-center p-6 space-y-4 relative z-10"></header>

      {/* Main Content Section */}
      <main className="flex-1 flex flex-col justify-center items-center space-y-4 p-4 text-center relative z-10">
        {' '}
        {/* Reduced padding and space between items */}
        {/* Logo with rounded edges */}
        <img src="/adventra-logo.png" alt="Adventra Logo" className="h-24 rounded-full" />{' '}
        {/* Adjusted logo size */}
        <h2 className="text-3xl font-[var(--font-heading)] text-center text-white">
          Welcome to Adventra
        </h2>
        <p className="text-lg text-center text-white">
          A social network for outdoor adventurers. Connect, share, and explore!
        </p>
        {/* Buttons for Login and Create Account */}
        <div className="flex flex-col space-y-2">
          {' '}
          {/* Reduced vertical space */}
          <button className="btn mt-4 bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white">
            Login
          </button>
          <a href="/signup" className="text-white hover:text-secondary text-lg mt-2">
            Don’t have an account? Sign up today!
          </a>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-primary text-white py-4 mt-8 relative z-10">
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
          <p>&copy; {new Date().getFullYear()} Adventra. All rights reserved.</p>
          <p className="mt-2 text-sm">
            Made with <span className="text-red-500">❤️</span> at{' '}
            <a
              href="https://www.kennesaw.edu/ccse/academics/software-engineering-and-game-development/index.php"
              target={'_blank'}
              className="hover:text-secondary"
            >
              KSU
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
