"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
function notFoundHandler(req, res) {
    res.status(404).json({ message: 'Not Found' });
}
function errorHandler(err, req, res, _next) {
    const isKnown = typeof err === 'object' && err !== null && 'status' in err;
    const status = isKnown ? err.status : 500;
    const message = isKnown ? err.message : 'Internal Server Error';
    if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error(err);
    }
    res.status(status).json({ message });
}
