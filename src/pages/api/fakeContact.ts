import type { NextApiRequest, NextApiResponse } from 'next';

interface ContactResponse {
    message: string;
}

interface ContactError {
    error: string;
}

/**
 * Mimics a contact form submission endpoint with an artificial delay.
 * This is a placeholder for backend integration in the future.
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ContactResponse | ContactError>,
): Promise<void> {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Simulate 1.5 second processing delay
    await new Promise<void>(resolve => setTimeout(resolve, 2000));

    // Return mock success
    return res.status(200).json({
        message: 'Message received. We will get back to you soon!',
    });
}
