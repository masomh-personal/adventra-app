import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { ModalProvider } from '@/contexts/ModalContext';
import '@/styles/globals.css';
import { Quicksand, Nunito, Baloo_2 } from 'next/font/google';

const headingFont = Quicksand({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-heading',
});

const bodyFont = Nunito({
    subsets: ['latin'],
    weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
    variable: '--font-body',
});

const accentFont = Baloo_2({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800'],
    variable: '--font-accent',
});

export default function MyApp({ Component, pageProps }: AppProps): React.JSX.Element {
    return (
        <ModalProvider>
            <div
                className={`${headingFont.variable} ${bodyFont.variable} ${accentFont.variable} flex flex-col min-h-screen`}
            >
                <Head>
                    <title>Adventra</title>
                    <meta name='viewport' content='width=device-width, initial-scale=1' />
                </Head>
                <Header />
                <main className='flex-grow flex'>
                    <Component {...pageProps} />
                </main>
                <Footer />
            </div>
        </ModalProvider>
    );
}
