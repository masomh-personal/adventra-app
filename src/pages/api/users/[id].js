/**
 * @route   GET /api/users/:id
 * @desc    Fetch a user by ID
 * @access  Public (modify for authentication as needed)
 *
 * @route   PUT /api/users/:id
 * @desc    Update a user by ID
 * @access  Protected
 *
 * @route   DELETE /api/users/:id
 * @desc    Delete a user by ID
 * @access  Protected
 */

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case 'GET':
      res.status(200).json({ message: `Fetch user with ID: ${id}` });
      break;

    case 'PUT':
      res.status(200).json({ message: `Update user with ID: ${id}` });
      break;

    case 'DELETE':
      res.status(200).json({ message: `Delete user with ID: ${id}` });
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
