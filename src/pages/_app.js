import Footer from '@/components/Footer';
import Header from '@/components/Header';
import '@/styles/globals.css';
import { Montserrat, Lexend } from 'next/font/google';

// Load fonts with specific weights and attach to CSS variables
const headingFont = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-heading',
});

const bodyFont = Lexend({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-body',
});

export default function MyApp({ Component, pageProps }) {
  return (
    <div className={`${headingFont.variable} ${bodyFont.variable} flex flex-col min-h-screen`}>
      <Header />
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}
