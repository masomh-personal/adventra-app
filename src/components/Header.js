export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-primary-light shadow-md relative z-10">
      <a href="/" className="flex items-center space-x-2">
        <img src="/adventra-logo.png" alt="Adventra Logo" className="h-12" />
        <span className="text-white text-2xl font-heading font-semibold lowercase tracking-wide">
          adventra
        </span>
      </a>

      <nav className="space-x-6 font-heading font-bold text-white">
        <a href="/" className="hover:text-primary">
          Home
        </a>
        <a href="/about" className="hover:text-primary">
          About
        </a>
        <a href="/login" className="hover:text-primary">
          Login
        </a>
      </nav>
    </header>
  );
}
