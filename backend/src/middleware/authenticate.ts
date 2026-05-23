import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { env } from '../config/env';
import { AuthError } from '../lib/errors';

const client = jwksClient({
  jwksUri: `${env.SUPABASE_URL}/rest/v1/rpc/jwks`,
  cache: true,
  cacheMaxAge: 3600000 // 1 hour
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  client.getSigningKey(header.kid, function(err, key) {
    if (err) {
      return callback(err);
    }
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AuthError('Missing or invalid authorization header'));
  }

  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return next(new AuthError('Token not found'));
  }

  jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded: any) => {
    if (err) {
      return next(new AuthError('Invalid or expired token'));
    }

    req.user = {
      id: decoded.sub as string,
      email: decoded.email,
    };
    
    // Supabase often puts app_metadata or user_metadata where custom claims might live
    if (decoded.user_metadata?.org_id) {
      req.orgId = decoded.user_metadata.org_id;
    }

    next();
  });
}
