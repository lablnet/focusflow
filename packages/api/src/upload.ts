import type { AxiosInstance } from 'axios';
import { api } from './client.js';

export const uploadActions = (client: AxiosInstance = api) => ({
    uploadImage: async (file: Buffer | Blob | File, filename: string): Promise<{ id: number; url: string }> => {
        const formData = new FormData();
        // Check if Buffer (Node.js) or Blob/File (Browser)
        if (Buffer.isBuffer(file)) {
            // In Node.js environment
            formData.append('image', new Blob([new Uint8Array(file)]), filename);
        } else {
            // In Browser environment
            formData.append('image', file, filename);
        }

        const { data } = await client.post<{ url: string; imageId: number }>('/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return {
            id: data.imageId,
            url: data.url,
        };
    },
});
