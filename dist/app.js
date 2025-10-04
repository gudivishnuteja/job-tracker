"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const error_1 = require("./middleware/error");
// Routers (to be implemented)
const auth_1 = __importDefault(require("./routes/auth"));
const jobs_1 = __importDefault(require("./routes/jobs"));
const applications_1 = __importDefault(require("./routes/applications"));
const reminders_1 = __importDefault(require("./routes/reminders"));
const documents_1 = __importDefault(require("./routes/documents"));
const contacts_1 = __importDefault(require("./routes/contacts"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '1mb' }));
app.use((0, morgan_1.default)('dev'));
app.get('/health', (_req, res) => {
    res.json({ ok: true, uptime: process.uptime() });
});
app.use('/api/auth', auth_1.default);
app.use('/api/jobs', jobs_1.default);
app.use('/api/applications', applications_1.default);
app.use('/api/reminders', reminders_1.default);
app.use('/api/documents', documents_1.default);
app.use('/api/contacts', contacts_1.default);
app.use('/api/analytics', analytics_1.default);
app.use(error_1.notFoundHandler);
app.use(error_1.errorHandler);
exports.default = app;
