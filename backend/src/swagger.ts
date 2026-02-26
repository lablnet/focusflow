import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'TimeTracker Backend API',
            version: '1.0.0',
            description: 'API Documentation for the Timetracker Node.js Backend using Express and Drizzle ORM.',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{
            bearerAuth: [],
        }],
    },
    // Reads JSDoc comments from all route definition files
    apis: [
        './src/apps/*/routes/*.ts',
        './src/apps/*/controllers/*.ts'
    ],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Application) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
