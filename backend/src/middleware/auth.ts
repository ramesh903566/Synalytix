import { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase';

/**
 * Authentication Middleware
 *
 * Every protected route passes through this middleware.
 * It reads the Authorization header, verifies the JWT that Supabase
 * issued when the user logged in on your frontend, and attaches
 * the user's ID to req.userId so route handlers can use it.
 *
 * Your frontend sends requests like:
 *   fetch('/api/data/github/profile', {
 *     headers: { Authorization: `Bearer ${supabase.auth.session()?.access_token}` }
 *   })
 */
function getBearerToken(req: Request): string {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice('Bearer '.length).trim();
  }

  return '';
}

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = getBearerToken(req);

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Missing or invalid Authorization token.',
    });
    return;
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      res.status(401).json({
        success: false,
        error: 'Invalid token. Please sign in again.',
      });
      return;
    }

    req.userId = data.user.id;
    req.userEmail = data.user.email;

    next();
  } catch {
    res.status(500).json({ success: false, error: 'Authentication failed' });
  }
}

/**
 * Optional auth — doesn't block the request if no token,
 * but attaches userId if token is valid. Useful for public endpoints
 * that behave differently for logged-in users.
 */
export async function optionalAuthenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = getBearerToken(req);
  if (!token) {
    return next();
  }

  try {
    const { data } = await supabase.auth.getUser(token);
    req.userId = data.user?.id;
    req.userEmail = data.user?.email;
  } catch {
    // Token invalid — just continue without userId
  }

  next();
}
