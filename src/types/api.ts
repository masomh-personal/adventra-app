import type { NextApiRequest, NextApiResponse } from 'next';
import type { UserProfile } from './user';

export interface ApiError {
  error: string;
}

export interface ApiSuccess<T = unknown> {
  data?: T;
  profiles?: T[];
  message?: string;
}

export type ApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse<ApiSuccess | ApiError>,
) => Promise<void> | void;

export interface ProfileResponse extends UserProfile {}

export interface UsersResponse {
  profiles: UserProfile[];
}

export interface ProfileByIdParams {
  id: string;
}
