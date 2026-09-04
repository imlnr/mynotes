const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    console.error(err);

    const status = err.statusCode || err.status || 500;
    res.status(status).json({
        status: status >= 500 ? 'error' : 'fail',
        message: err.message || 'Something went wrong.',
    });
};

module.exports = errorHandler;
