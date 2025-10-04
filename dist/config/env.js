"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function getEnv(name, fallback) {
    const value = process.env[name] ?? fallback;
    if (value === undefined) {
        throw new Error(`Missing required env var: ${name}`);
    }
    return value;
}
exports.env = {
    nodeEnv: getEnv('NODE_ENV', 'development'),
    port: parseInt(getEnv('PORT', '4000'), 10),
    mongoUri: getEnv('MONGO_URI'),
    jwtAccessSecret: getEnv('JWT_ACCESS_SECRET'),
    jwtRefreshSecret: getEnv('JWT_REFRESH_SECRET'),
    jwtAccessExpires: getEnv('JWT_ACCESS_EXPIRES', '15m'),
    jwtRefreshExpires: getEnv('JWT_REFRESH_EXPIRES', '7d'),
};
