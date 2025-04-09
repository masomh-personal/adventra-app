import Link from 'next/link';
import Button from './Button';
import { AiFillHeart } from 'react-icons/ai';
import { FaCodeBranch } from 'react-icons/fa';

export default function Footer() {
  const gitSha = process.env.NEXT_PUBLIC_GIT_SHA || 'dev';
  const repoUrl = 'https://github.com/masomh-personal/adventra-app';

  // Styles for the build tag link - adjusted for inline flow
  const buildTagStyle = `
    inline-flex items-center gap-1       /* Use inline-flex for inline block behavior */
    bg-gray-700 bg-opacity-75
    text-gray-300 hover:text-white
    text-xs
    font-mono
    font-bold
    px-2 py-1
    rounded
    border border-gray-500 border-opacity-50
    transition-colors duration-200
    no-underline
    mt-2                                /* Add margin-top to separate from line above */
  `;

  return (
    // Removed relative positioning as it's no longer needed for the tag
    <footer className="bg-primary text-white py-4 z-10 px-4">
      {/* Main content container */}
      <div className="flex flex-col items-center">
        {/* Links */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 font-body font-bold">
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

        {/* Copyright, Made With, and Build Info */}
        <div className="text-center mt-4 text-sm">
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
          {/* Build Tag moved here, wrapped in its own paragraph for block layout */}
          <p>
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buildTagStyle} // Apply the styles
              title={`Build: ${gitSha} (View Repository)`}
            >
              <FaCodeBranch />
              <span>build: v{gitSha}</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
