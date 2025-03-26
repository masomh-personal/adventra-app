import Footer from '@/components/Footer';
import Header from '@/components/Header';
import '@/styles/globals.css';
import { Quicksand, Nunito } from 'next/font/google';

// Load fonts with specific weights and attach to CSS variables
const headingFont = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
});

const bodyFont = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
});

export default function MyApp({ Component, pageProps }) {
  return (
    <div className={`${headingFont.variable} ${bodyFont.variable} flex flex-col min-h-screen`}>
      <Header />
      <main className="flex-grow flex">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}
