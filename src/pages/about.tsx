import React, { useState } from 'react';

export default function AboutPage(): React.JSX.Element {
    const [openFAQ, setOpenFAQ] = useState<string | null>(null);

    const toggleFAQ = (id: string): void => {
        setOpenFAQ(openFAQ === id ? null : id);
    };

    return (
        <div className='w-full flex-grow bg-background text-foreground font-body'>
            <div className='max-w-4xl mx-auto px-6 py-12'>
                <h1 className='text-4xl font-heading text-center mb-8'>About Adventra</h1>

                <p className='text-lg mb-8 text-center'>
                    We believe the best memories are made outside.
                </p>

                <section className='mb-12'>
                    <h2 className='text-3xl font-heading mb-4'>Our Mission</h2>
                </section>

                <section className='mb-12'>
                    <h2 className='text-3xl font-heading mb-4'>Why Adventra</h2>
                </section>

                <section className='mb-12'>
                    <h2 className='text-3xl font-heading mb-4'>What Makes Us Different</h2>
                </section>

                <section className='mb-12'>
                    <h2 className='text-3xl font-heading mb-4'>Our Future Vision</h2>
                </section>

                <section className='mb-12'>
                    <h2 className='text-3xl font-heading mb-4'>Frequently Asked Questions</h2>
                    <div className='space-y-4'>
                        <div>
                            <button
                                type='button'
                                onClick={() => toggleFAQ('free')}
                                className='text-left w-full'
                            >
                                Is Adventra free to use?
                            </button>
                            {openFAQ === 'free' && (
                                <div>
                                    <p>Adventra is free to join and use</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
