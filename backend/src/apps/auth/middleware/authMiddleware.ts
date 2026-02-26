import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/token';
import { dlog } from '../../../utils/log';

export interface AuthRequest extends Request {
    user?: TokenPayload;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Unauthorized: No token provided' });
            return;
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyAccessToken(token);

        req.user = decoded; // Attach payload to request
        next();
    } catch (error: any) {
        dlog('Auth error:', error.message);
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({ error: 'Unauthorized: Token expired' });
            return;
        }
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
        return;
    }
};
