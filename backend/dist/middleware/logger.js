"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLogger = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("../config/env");
exports.logger = winston_1.default.createLogger({
    level: env_1.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), env_1.env.NODE_ENV === 'production' ? winston_1.default.format.json() : winston_1.default.format.prettyPrint()),
    transports: [
        new winston_1.default.transports.Console()
    ]
});
// Morgan middleware using Winston
exports.httpLogger = (0, morgan_1.default)(env_1.env.NODE_ENV === 'production' ? 'combined' : 'dev', {
    stream: {
        write: (message) => exports.logger.info(message.trim())
    }
});
