import { Response } from 'express';
import { AuthRequest } from '../../auth/middleware/authMiddleware';
import { getTrackingLimits, getEstimatedMinutesToday, insertActivityLog, getRecentLogs } from '../models/activityModel';

export const storeLog = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.userId;
        const {
            timestamp, keystrokes, mouseMoves, focusScore,
            category, windowTitle, imageId, activities, minuteBreakdown
        } = req.body;

        // 1. Fetch User and Company Settings to enforce Daily Limits
        const maxDailyLimits = await getTrackingLimits(userId);

        if (maxDailyLimits) {
            const estimatedMinutesToday = await getEstimatedMinutesToday(userId);

            if (estimatedMinutesToday >= maxDailyLimits) {
                res.status(403).json({ error: 'Daily time tracking limit reached for this company/user' });
                return;
            }
        }

        const exactDate = new Date(timestamp);

        // 2. Store the Log
        const log = await insertActivityLog({
            userId,
            timestamp: exactDate,
            keystrokes,
            mouseMoves,
            focusScore,
            category,
            windowTitle,
            imageId,
            activities,
            minuteBreakdown
        });

        res.status(201).json({ message: 'Log stored successfully', id: log.id });
    } catch (error: any) {
        console.error('Store log error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getLogs = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.userId;
        const logs = await getRecentLogs(userId, 100);

        res.status(200).json({ logs });
    } catch (error: any) {
        console.error('Get logs error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
