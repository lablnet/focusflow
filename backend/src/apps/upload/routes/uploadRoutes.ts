import { Router } from 'express';
import { authMiddleware } from '../../auth/middleware/authMiddleware';
import { uploadImage } from '../controllers/uploadController';
import multer from 'multer';

const router = Router();

// Configure Multer to buffer files in memory (perfect for direct blazing fast S3 streaming)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit per screenshot
    }
});

/**
 * @openapi
 * /api/upload/image:
 *   post:
 *     summary: Upload a screenshot to AWS S3 securely attached to the User's credentials.
 *     tags:
 *       - Upload
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The raw image file object
 *     responses:
 *       201:
 *         description: Image uploaded securely, returns Image ID for use in Activity Logs.
 *       400:
 *         description: Missing or invalid file.
 */
router.post('/image', authMiddleware, upload.single('image'), uploadImage);

export default router;
