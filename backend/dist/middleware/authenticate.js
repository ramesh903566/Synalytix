"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
const env_1 = require("../config/env");
const errors_1 = require("../lib/errors");
const client = (0, jwks_rsa_1.default)({
    jwksUri: `${env_1.env.SUPABASE_URL}/rest/v1/rpc/jwks`,
    cache: true,
    cacheMaxAge: 3600000 // 1 hour
});
function getKey(header, callback) {
    client.getSigningKey(header.kid, function (err, key) {
        if (err) {
            return callback(err);
        }
        const signingKey = key?.getPublicKey();
        callback(null, signingKey);
    });
}
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return next(new errors_1.AuthError('Missing or invalid authorization header'));
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return next(new errors_1.AuthError('Token not found'));
    }
    jsonwebtoken_1.default.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) {
            return next(new errors_1.AuthError('Invalid or expired token'));
        }
        req.user = {
            id: decoded.sub,
            email: decoded.email,
        };
        // Supabase often puts app_metadata or user_metadata where custom claims might live
        if (decoded.user_metadata?.org_id) {
            req.orgId = decoded.user_metadata.org_id;
        }
        next();
    });
}
