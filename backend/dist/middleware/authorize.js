"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = requireRole;
const errors_1 = require("../lib/errors");
const client_1 = require("../db/client");
const redis_1 = require("../lib/redis");
const roleHierarchy = {
    viewer: 1,
    member: 2,
    manager: 3,
    admin: 4,
    owner: 5,
};
function requireRole(minimumRole) {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                throw new errors_1.AuthError('User not authenticated');
            }
            // Organization context can come from route params (e.g. /orgs/:id) or headers
            const orgIdParam = req.params.orgId || req.params.id || req.headers['x-org-id'] || req.orgId;
            const orgId = Array.isArray(orgIdParam) ? orgIdParam[0] : orgIdParam;
            if (!orgId) {
                throw new errors_1.ForbiddenError('Organization context is missing');
            }
            // Check redis cache
            const cacheKey = `role:${orgId}:${req.user.id}`;
            let userRole = await redis_1.redis.get(cacheKey);
            if (!userRole) {
                const membership = await client_1.prisma.organizationMember.findUnique({
                    where: {
                        organization_id_user_id: {
                            organization_id: orgId,
                            user_id: req.user.id,
                        },
                    },
                });
                if (!membership) {
                    throw new errors_1.ForbiddenError('User is not a member of this organization');
                }
                userRole = membership.role;
                await redis_1.redis.set(cacheKey, userRole, 'EX', 300); // 5 minutes
            }
            const userRoleLevel = roleHierarchy[userRole] || 0;
            const requiredRoleLevel = roleHierarchy[minimumRole] || 0;
            if (userRoleLevel < requiredRoleLevel) {
                throw new errors_1.ForbiddenError(`Requires ${minimumRole} role or higher`);
            }
            // Attach resolved orgId
            req.orgId = orgId;
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
