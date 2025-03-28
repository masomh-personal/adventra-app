import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-4 relative z-10">
      <div className="flex flex-wrap justify-center gap-4 sm:gap-8 font-body font-bold px-4">
        <Link href="/about" className="hover:text-secondary">
          About
        </Link>
        <Link href="/privacy-policy" className="hover:text-secondary">
          Privacy Policy
        </Link>
        <Link href="/contact" className="hover:text-secondary">
          Contact
        </Link>
      </div>
      <div className="text-center mt-4 text-sm px-4">
        <p>&copy; {new Date().getFullYear()} Adventra. All rights reserved.</p>
        <p className="mt-2">
          Made with <span className="text-red-500">❤️ </span>
          <a
            href="https://www.kennesaw.edu/ccse/academics/software-engineering-and-game-development/index.php"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-secondary underline"
          >
            KSU's Software & Game Development Dept
          </a>
        </p>
      </div>
    </footer>
  );
}
