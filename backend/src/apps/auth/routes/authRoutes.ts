import { Router } from 'express';
import { register, login, refresh, logout, me } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';
import validateRequest from '../../../middleware/validateRequest';
import { registerValidator, loginValidator, refreshValidator } from '../validators/authValidator';

const router = Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user and create a company
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyName
 *               - name
 *               - email
 *               - password
 *             properties:
 *               companyName:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Validation error or email exists
 */
router.post('/register', validateRequest(registerValidator), register);

router.post('/login', validateRequest(loginValidator), login);

router.post('/refresh', validateRequest(refreshValidator), refresh);

router.post('/logout', logout);

// Protected routes
router.get('/me', authMiddleware, me);

export default router;
