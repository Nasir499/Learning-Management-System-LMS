const errorMiddleware = (err, req, res, next) => {
    // Prefer explicit statusCode set by AppError, then any http_code from external libs (e.g., Cloudinary), then fall back to 500
    const statusCode = err.statusCode || err.http_code || err.status || 500;
    const message = err.message || 'Kuch to galat hai';

    // Log the error with its HTTP code for server-side debugging
    console.error('Error handled by middleware:', { message: err.message, statusCode, name: err.name, http_code: err.http_code });

    res.status(statusCode).json({
        success: false,
        message,
        // include raw error info for debugging in non-production environments
        details: (process.env.NODE_ENV !== 'production') ? { name: err.name, http_code: err.http_code, stack: err.stack } : undefined,
    });
};

export default errorMiddleware;