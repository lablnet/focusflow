import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '../utils/token';
import { findUserByEmail, findUserById, registerUserWithCompany } from '../models/userModel';
import { createSession, findActiveSessionByToken, revokeSession } from '../models/sessionModel';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { companyName, name, email, password } = req.body;

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            res.status(400).json({ error: 'Email already in use' });
            return;
        }

        const passwordHash = await bcrypt.hash(password, 10);
        await registerUserWithCompany(companyName, name, email, passwordHash);

        res.status(201).json({ message: 'Registration successful. Please login.' });
    } catch (error: any) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, deviceInfo } = req.body;

        const user = await findUserByEmail(email);
        if (!user) {
            res.status(400).json({ error: 'Invalid credentials' });
            return;
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            res.status(400).json({ error: 'Invalid credentials' });
            return;
        }

        const refreshToken = generateRefreshToken({ userId: user.id, role: user.role });

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';

        const session = await createSession(user.id, refreshToken, deviceInfo || 'Unknown Device', ipAddress, expiresAt);
        const accessToken = generateAccessToken({ userId: user.id, sessionId: session.id, role: user.role });

        res.status(200).json({
            message: 'Login successful',
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                companyId: user.companyId
            }
        });
    } catch (error: any) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
    try {
        const { refreshToken } = req.body;

        const session = await findActiveSessionByToken(refreshToken);
        if (!session) {
            res.status(401).json({ error: 'Invalid or revoked refresh token' });
            return;
        }

        if (session.expiresAt < new Date()) {
            res.status(401).json({ error: 'Refresh token expired' });
            return;
        }

        const accessToken = generateAccessToken({ userId: session.userId, sessionId: session.id });
        res.status(200).json({ accessToken });
    } catch (error: any) {
        console.error('Refresh error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        const { refreshToken } = req.body;
        if (refreshToken) {
            await revokeSession(refreshToken);
        }
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error: any) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const me = async (req: any, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const user = await findUserById(userId);

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json({ user });
    } catch (error: any) {
        console.error('Me error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
