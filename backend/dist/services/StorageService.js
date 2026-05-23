"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const env_1 = require("../config/env");
exports.supabase = (0, supabase_js_1.createClient)(env_1.env.SUPABASE_URL, env_1.env.SUPABASE_SERVICE_ROLE_KEY);
class StorageService {
    static async getSignedUploadUrl(bucket, path) {
        const { data, error } = await exports.supabase
            .storage
            .from(bucket)
            .createSignedUploadUrl(path);
        if (error)
            throw error;
        return data;
    }
}
exports.StorageService = StorageService;
