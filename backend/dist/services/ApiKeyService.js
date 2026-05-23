"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyService = void 0;
const client_1 = require("../db/client");
const errors_1 = require("../lib/errors");
const ActivityService_1 = require("./ActivityService");
const nanoid_1 = require("nanoid");
const crypto_1 = __importDefault(require("crypto"));
class ApiKeyService {
    static async createKey(orgId, userId, data) {
        const rawKey = `syn_live_${(0, nanoid_1.nanoid)(32)}`;
        const hashedKey = crypto_1.default.createHash('sha256').update(rawKey).digest('hex');
        const prefix = rawKey.substring(0, 12);
        const apiKey = await client_1.prisma.apiKey.create({
            data: {
                organization_id: orgId,
                name: data.name,
                hashed_key: hashedKey,
                prefix,
                permissions: data.permissions || [],
            },
        });
        await ActivityService_1.ActivityService.log({
            organizationId: orgId,
            userId,
            action: 'CREATE_API_KEY',
            entityType: 'api_key',
            entityId: apiKey.id,
        });
        return { ...apiKey, key: rawKey }; // Return raw key only once
    }
    static async listKeys(orgId) {
        const keys = await client_1.prisma.apiKey.findMany({
            where: { organization_id: orgId, deleted_at: null },
            select: {
                id: true,
                name: true,
                prefix: true,
                permissions: true,
                last_used_at: true,
                created_at: true,
            },
            orderBy: { created_at: 'desc' },
        });
        return keys;
    }
    static async updateKey(orgId, keyId, userId, data) {
        const key = await client_1.prisma.apiKey.findFirst({
            where: { id: keyId, organization_id: orgId, deleted_at: null },
        });
        if (!key)
            throw new errors_1.NotFoundError('API Key not found');
        const updated = await client_1.prisma.apiKey.update({
            where: { id: key.id },
            data: {
                name: data.name,
                permissions: data.permissions,
            },
            select: {
                id: true,
                name: true,
                prefix: true,
                permissions: true,
                last_used_at: true,
                created_at: true,
            },
        });
        await ActivityService_1.ActivityService.log({
            organizationId: orgId,
            userId,
            action: 'UPDATE_API_KEY',
            entityType: 'api_key',
            entityId: key.id,
            metadata: data,
        });
        return updated;
    }
    static async deleteKey(orgId, keyId, userId) {
        const key = await client_1.prisma.apiKey.findFirst({
            where: { id: keyId, organization_id: orgId, deleted_at: null },
        });
        if (!key)
            throw new errors_1.NotFoundError('API Key not found');
        await client_1.prisma.apiKey.update({
            where: { id: key.id },
            data: { deleted_at: new Date() },
        });
        await ActivityService_1.ActivityService.log({
            organizationId: orgId,
            userId,
            action: 'DELETE_API_KEY',
            entityType: 'api_key',
            entityId: key.id,
        });
        return { success: true };
    }
}
exports.ApiKeyService = ApiKeyService;
