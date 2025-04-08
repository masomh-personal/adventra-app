import Link from 'next/link';
import Button from './Button';
import { AiFillHeart } from 'react-icons/ai'; // Import the heart icon

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
        <p className="mt-2 flex items-center justify-center gap-1 flex-wrap">
          Made with <AiFillHeart className="text-red-500" />
          <Button
            as="a"
            href="https://www.kennesaw.edu/ccse/academics/software-engineering-and-game-development/index.php"
            label="KSU SWE Dept"
            variant="clean"
            size="sm"
            className="text-xs px-2 py-1"
            aria-label="Go to KSU's Software & Game Development Dept"
            testId="ksu-button"
            target="_blank"
            rel="noopener noreferrer"
          />
        </p>
      </div>
    </footer>
  );
}
