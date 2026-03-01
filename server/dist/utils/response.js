export function sendError(res, statusCode, error, code) {
    return res.status(statusCode).json({ error, code });
}
