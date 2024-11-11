"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = requestLogger;
function requestLogger(req, res, next) {
    const startTime = Date.now();
    // Capture the initial request details
    console.log(`[Request] ${req.method} ${req.url}`);
    // Add a listener for the 'finish' event to capture response details
    res.on('finish', () => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        console.log(`[Response] ${req.method} ${req.url} ${res.statusCode} - ${responseTime}ms`);
    });
    next();
}
