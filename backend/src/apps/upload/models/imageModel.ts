import { db } from '../../../db';
import { imagesTable } from '../../../db/schema';

export const insertImageRecord = async (userId: number, s3Key: string, url: string, size: number, mimeType: string) => {
    const [image] = await db.insert(imagesTable).values({
        userId,
        s3Key,
        url,
        size,
        mimeType
    }).returning({ id: imagesTable.id });

    return image;
};
