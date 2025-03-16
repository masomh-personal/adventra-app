import Footer from '@/components/Footer';
import Header from '@/components/Header';
import '@/styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}
