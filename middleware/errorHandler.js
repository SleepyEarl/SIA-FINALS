const errorHandler = (err, req, res, next) => {
    const timestamp = new Date().toISOString();
    const path = req.originalUrl;
    const method = req.method;

    // Log error details
    console.error(`
    ❌ Error occurred at ${timestamp}
    Path: ${method} ${path}
    Message: ${err.message}
    Stack: ${err.stack}
    `);

    // Default error response
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let details = err.details || null;

    // Handle specific error types
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error';
        details = err.details;
    } else if (err.name === 'NotFoundError') {
        statusCode = 404;
        message = 'Resource Not Found';
    } else if (err.name === 'UnauthorizedError') {
        statusCode = 401;
        message = 'Unauthorized';
    } else if (err.name === 'ForbiddenError') {
        statusCode = 403;
        message = 'Forbidden';
    } else if (err.name === 'ConflictError') {
        statusCode = 409;
        message = 'Resource Already Exists';
    }

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        details,
        timestamp,
        path
    });
};

module.exports = errorHandler;
