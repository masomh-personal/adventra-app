export default function HomePage() {
  return (
    <div className="min-h-screen text-foreground flex flex-col justify-between">
      {/* Video Background (or GIF background) */}
      <div className="absolute top-0 left-0 w-full h-full z-[-1]">
        <video autoPlay muted aria-hidden="true" className="w-full h-full object-cover">
          <source src="/media/hiking.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Main Content Section */}
      <div className="flex-1 flex flex-col justify-center items-center space-y-4 p-4 text-center relative z-10">
        {' '}
        {/* Reduced padding and space between items */}
        {/* Logo with rounded edges */}
        {/*<img src="/adventra-logo.png" alt="Adventra Logo" className="h-24 rounded-full" />{' '}*/}
        {/* Adjusted logo size */}
        <h2 className="text-3xl font-heading text-center text-white">Welcome to Adventra</h2>
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
      </div>
    </div>
  );
}
