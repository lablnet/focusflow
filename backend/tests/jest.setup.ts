
import dotenv from 'dotenv';
import path from 'path';

// Load .env.test if it exists
dotenv.config({ path: path.resolve(__dirname, '../.env.test') });
