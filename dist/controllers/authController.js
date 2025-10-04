"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.refresh = refresh;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const env_1 = require("../config/env");
function signAccessToken(userId) {
    const payload = { sub: userId, type: 'access' };
    const options = { expiresIn: env_1.env.jwtAccessExpires };
    return jsonwebtoken_1.default.sign(payload, env_1.env.jwtAccessSecret, options);
}
function signRefreshToken(userId) {
    const payload = { sub: userId, type: 'refresh' };
    const options = { expiresIn: env_1.env.jwtRefreshExpires };
    return jsonwebtoken_1.default.sign(payload, env_1.env.jwtRefreshSecret, options);
}
async function register(req, res) {
    const { name, email, password, timezone } = req.body;
    if (!name || !email || !password)
        return res.status(400).json({ message: 'Missing required fields' });
    const existing = await User_1.User.findOne({ email }).lean();
    if (existing)
        return res.status(409).json({ message: 'Email already registered' });
    const passwordHash = await bcryptjs_1.default.hash(password, 10);
    const user = await User_1.User.create({ name, email, passwordHash, timezone });
    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);
    return res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, timezone: user.timezone }, accessToken, refreshToken });
}
async function login(req, res) {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: 'Missing credentials' });
    const user = await User_1.User.findOne({ email });
    if (!user)
        return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!ok)
        return res.status(401).json({ message: 'Invalid credentials' });
    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);
    return res.json({ user: { id: user.id, name: user.name, email: user.email, timezone: user.timezone }, accessToken, refreshToken });
}
async function refresh(req, res) {
    const { refreshToken } = req.body;
    if (!refreshToken)
        return res.status(400).json({ message: 'Missing refreshToken' });
    try {
        const payload = jsonwebtoken_1.default.verify(refreshToken, env_1.env.jwtRefreshSecret);
        if (payload.type !== 'refresh')
            return res.status(401).json({ message: 'Invalid token type' });
        const accessToken = signAccessToken(payload.sub);
        const newRefreshToken = signRefreshToken(payload.sub);
        return res.json({ accessToken, refreshToken: newRefreshToken });
    }
    catch (_err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}
