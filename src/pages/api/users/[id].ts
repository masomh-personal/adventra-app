import type { NextApiRequest, NextApiResponse } from 'next';
import type { ApiError, ApiSuccess } from '@/types/api';

/**
 * @route   GET /api/users/:id
 * @desc    Fetch a user by ID
 * @access  Public
 *
 * @route   PUT /api/users/:id
 * @desc    Update a user by ID
 * @access  Protected
 *
 * @route   DELETE /api/users/:id
 * @desc    Delete a user by ID
 * @access  Protected
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiSuccess | ApiError>
): Promise<void> {
  const {
    query: { id },
    method,
  } = req;

  const userId = Array.isArray(id) ? id[0] : id;

  switch (method) {
    case 'GET':
      res.status(200).json({ message: `Fetch user with ID: ${userId}` });
      break;

    case 'PUT':
      res.status(200).json({ message: `Update user with ID: ${userId}` });
      break;

    case 'DELETE':
      res.status(200).json({ message: `Delete user with ID: ${userId}` });
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}
