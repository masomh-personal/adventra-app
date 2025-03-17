export default function HomePage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center text-white text-center overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover z-[-1]"
      >
        <source src="/media/hiking.mp4" type="video/mp4" />
      </video>

      {/* Main Content */}
      <section className="z-10 px-4 space-y-4">
        {/* Optional Logo */}
        {/* <img src="/adventra-logo.png" alt="Adventra Logo" className="h-24 rounded-full mx-auto" /> */}

        <h2 className="text-4xl font-heading">🏕️ Welcome to Adventra</h2>
        <p className="text-lg font-body">
          A social network for outdoor adventurers. Connect, share, and explore!
        </p>

        <div className="flex flex-col items-center space-y-2">
          <button className="btn mt-4 bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white">
            Login
          </button>
          <a href="/signup" className="hover:text-secondary text-lg mt-2">
            Don’t have an account? Sign up today!
          </a>
        </div>
      </section>
    </div>
  );
}
