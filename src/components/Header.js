export default function Header() {
  return (
    <header className="flex justify-between items-center p-6 bg-white shadow-md relative z-10">
      <img src="/adventra-logo.png" alt="Adventra Logo" className="h-12" />
      <nav className="space-x-6 text-primary font-heading">
        <a href="/about" className="hover:text-secondary">
          About
        </a>
        <a href="/login" className="hover:text-secondary">
          Login
        </a>
        <a href="/signup" className="hover:text-secondary">
          Sign Up
        </a>
      </nav>
    </header>
  );
}
