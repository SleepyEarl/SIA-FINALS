const requestLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const path = req.originalUrl;
    const ip = req.ip;

    // Log request details
    console.log(`[${timestamp}] ${method.padEnd(6)} ${path.padEnd(40)} | IP: ${ip}`);

    // Override res.json to log response
    const originalJson = res.json;
    res.json = function(data) {
        const statusCode = res.statusCode;
        console.log(`[${timestamp}] Response: ${statusCode} ${data?.message || 'Success'}`);
        return originalJson.call(this, data);
    };

    next();
};

module.exports = requestLogger;
