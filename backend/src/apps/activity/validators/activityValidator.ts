import { body } from 'express-validator';

export const storeLogValidator = [
    body('timestamp').isNumeric().withMessage('Timestamp is required'),
    body('keystrokes').isNumeric(),
    body('mouseMoves').isNumeric(),
    body('focusScore').isNumeric(),
    body('category').optional().isString(),
    body('windowTitle').optional().isString(),
    body('imageId').optional().isNumeric(),
];
