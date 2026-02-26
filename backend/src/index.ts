import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import cors from 'cors';

import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorHandler';

const app: Application = express();
const port = process.env.PORT || 8000;

// CORS Configuration
const allowedOrigins = [
  'http://localhost:8000',
  'http://localhost:3000',
  'http://localhost:5173'
];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

// index route
app.get('/', (_, res) => {
  res.send('Hello World');
});
// health check route
app.get('/health', (_, res) => {
  res.send('OK');
});

// Global Error Handler
app.use(errorHandler);

export default app;

if (require.main === module) {
  app.listen(parseInt(port.toString()), '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}
