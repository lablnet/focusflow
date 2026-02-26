import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from 'crypto';

const bucketName = process.env.AWS_S3_BUCKET_NAME || '';

const s3 = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    }
});

/**
 * Upload an image buffer directly to the configured AWS S3 bucket.
 * 
 * @param fileBuffer The raw binary buffer
 * @param mimeType Mime type (e.g., 'image/png')
 * @returns An object containing the chosen S3 object Key and its formatted public URL
 */
export const uploadImageToS3 = async (fileBuffer: Buffer, mimeType: string, extension: string = 'png'): Promise<{ s3Key: string; url: string }> => {
    // Generate a secure, unique filename
    const uniqueHash = crypto.randomBytes(16).toString('hex');
    const s3Key = `screenshots/${Date.now()}-${uniqueHash}.${extension}`;

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
        Body: fileBuffer,
        ContentType: mimeType,
        // Depending on bucket policies you might want 'public-read'
        // ACL: 'public-read', 
    });

    await s3.send(command);

    // Format the URL (this assumes standard S3 regional URL layout)
    const url = `https://${bucketName}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${s3Key}`;

    return { s3Key, url };
};
