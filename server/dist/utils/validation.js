import { AppError } from '../middlewares/errorHandler.js';
import { ERROR_CODES } from '../constants/errorCodes.js';
import { ERROR_MESSAGES } from '../constants/errorMessages.js';
export function parseOrThrow(schema, input) {
    const parsed = schema.safeParse(input);
    if (!parsed.success) {
        throw new AppError(400, parsed.error.errors[0]?.message ?? ERROR_MESSAGES.validationFailed, ERROR_CODES.validationError);
    }
    return parsed.data;
}
