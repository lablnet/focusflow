import {describe, it, expect} from '@jest/globals';
import request from 'supertest';
import app from '../src/index';

describe('App Mounting & Basic Routes', () => {
    it('should respond with "Hello World" on the index route (/)', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Hello World');
    });

    it('should respond with "OK" on the health check route (/health)', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.text).toBe('OK');
    });

    it('should handle 404 for unknown routes', async () => {
        const response = await request(app).get('/unknown-route-12345');
        // Depending on your global error handler or setup, this might be 404
        expect(response.status).toBe(404);
    });
});
