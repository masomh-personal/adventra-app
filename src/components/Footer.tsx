import Link from 'next/link';
import Button from './Button';
import { AiFillHeart } from 'react-icons/ai';
import { FaGithub, FaCodeBranch } from 'react-icons/fa';

export default function Footer(): React.JSX.Element {
  const gitSha = process.env.NEXT_PUBLIC_GIT_SHA || 'dev-sha';
  const gitBranch = process.env.NEXT_PUBLIC_GIT_BRANCH || 'dev-branch';
  const repoUrl = 'https://github.com/masomh-personal/adventra-app';

  // Enhanced build/version tag styling with pizzazz
  const buildTagStyle = `
    group inline-flex items-center gap-2
    bg-[#161b22]
    text-[#c9d1d9] hover:text-white
    text-[0.7rem] font-mono font-medium
    px-2.5 py-1.5 rounded-md
    border border-white/60 hover:border-white/90
    shadow-sm hover:shadow-md
    transition-colors duration-200
    backdrop-blur-sm
    mt-1
    cursor-pointer
  `;

  return (
    <footer className="bg-primary text-white py-4 px-4 z-10">
      <div className="flex flex-col items-center">
        {/* Footer Links */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-7 font-body font-semibold">
          <Link href="/about" className="hover:text-secondary transition-colors duration-200">
            About
          </Link>
          <Link
            href="/privacy-policy"
            className="hover:text-secondary transition-colors duration-200"
          >
            Privacy Policy
          </Link>
          <Link href="/contact" className="hover:text-secondary transition-colors duration-200">
            Contact
          </Link>
        </div>

        {/* Attribution & Build Info */}
        <div className="text-center mt-2 text-sm space-y-2">
          <p className="font-semibold">
            &copy; {new Date().getFullYear()} Adventra. All rights reserved.
          </p>
          <p className="flex items-center justify-center gap-1 flex-wrap">
            Made with <AiFillHeart className="text-red-500" />
            <Button
              as="a"
              href="https://www.kennesaw.edu/ccse/academics/software-engineering-and-game-development/index.php"
              label="KSU SWE Dept"
              variant="ksu"
              className="ml-0.5"
              size="sm"
              aria-label="Go to KSU's Software & Game Development Dept"
              testId="ksu-button"
              target="_blank"
              rel="noopener noreferrer"
            />
          </p>

          {/* Build Version Tag */}
          <p>
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buildTagStyle}
              title={`Branch: ${gitBranch}\nFull SHA: ${gitSha}`}
            >
              {/* Branch and SHA */}
              <span className="flex items-center gap-1">
                <FaGithub className="w-4 h-4 opacity-80" />
                {gitBranch} |
                <FaCodeBranch className="w-3.5 h-3.5 opacity-70" /> {gitSha.slice(0, 7)}
              </span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
