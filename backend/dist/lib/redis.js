"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = require("ioredis");
const env_1 = require("../config/env");
exports.redis = new ioredis_1.Redis(env_1.env.REDIS_URL, {
    maxRetriesPerRequest: null,
});
exports.redis.on('error', (err) => {
    console.error('Redis error:', err);
});
