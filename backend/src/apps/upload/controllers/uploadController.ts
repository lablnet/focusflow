import { Response } from 'express';
import { AuthRequest } from '../../auth/middleware/authMiddleware';
import { uploadImageToS3 } from '../services/s3Service';
import { insertImageRecord } from '../models/imageModel';

export const uploadImage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.userId;
        const file = req.file;

        if (!file) {
            res.status(400).json({ error: 'No image file provided in the request' });
            return;
        }

        // Validate basic file types
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            res.status(400).json({ error: 'Invalid file type. Only JPG, PNG, GIF, and WEBP are allowed.' });
            return;
        }

        // Extract extension
        const ext = file.mimetype.split('/')[1];

        // 1. Upload the raw buffer to AWS S3 securely
        const { s3Key, url } = await uploadImageToS3(file.buffer, file.mimetype, ext);

        // 2. Insert the tracking record into the Local Database
        const imageRecord = await insertImageRecord(
            userId,
            s3Key,
            url,
            file.size,
            file.mimetype
        );

        res.status(201).json({
            message: 'Image uploaded securely to S3',
            imageId: imageRecord.id,
            url
        });
    } catch (error: any) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: 'Failed to upload image securely.' });
    }
};
