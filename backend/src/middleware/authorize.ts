import { Request, Response, NextFunction } from 'express';
import { AuthError, ForbiddenError } from '../lib/errors';
import { prisma } from '../db/client';
import { redis } from '../lib/redis';

const roleHierarchy: Record<string, number> = {
  viewer: 1,
  member: 2,
  manager: 3,
  admin: 4,
  owner: 5,
};

export function requireRole(minimumRole: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AuthError('User not authenticated');
      }

      // Organization context can come from route params (e.g. /orgs/:id) or headers
      const orgIdParam = req.params.orgId || req.params.id || req.headers['x-org-id'] || req.orgId;
      const orgId = Array.isArray(orgIdParam) ? orgIdParam[0] : orgIdParam;

      if (!orgId) {
        throw new ForbiddenError('Organization context is missing');
      }

      // Check redis cache
      const cacheKey = `role:${orgId}:${req.user.id}`;
      let userRole = await redis.get(cacheKey);

      if (!userRole) {
        const membership = await prisma.organizationMember.findUnique({
          where: {
            organization_id_user_id: {
              organization_id: orgId,
              user_id: req.user.id,
            },
          },
        });

        if (!membership) {
          throw new ForbiddenError('User is not a member of this organization');
        }

        userRole = membership.role;
        await redis.set(cacheKey, userRole, 'EX', 300); // 5 minutes
      }

      const userRoleLevel = roleHierarchy[userRole] || 0;
      const requiredRoleLevel = roleHierarchy[minimumRole] || 0;

      if (userRoleLevel < requiredRoleLevel) {
        throw new ForbiddenError(`Requires ${minimumRole} role or higher`);
      }

      // Attach resolved orgId
      req.orgId = orgId;
      
      next();
    } catch (error) {
      next(error);
    }
  };
}
