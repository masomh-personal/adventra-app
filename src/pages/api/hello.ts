import type { NextApiRequest, NextApiResponse } from 'next';

interface HelloResponse {
  name: string;
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<HelloResponse>
): void {
  res.status(200).json({ name: 'John Doe' });
}
