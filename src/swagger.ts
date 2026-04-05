import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Finance Data Processing API',
    version: '1.0.0',
    description: 'API for Finance Data Processing',
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
  security: [{ bearerAuth: [] }],
  paths: {
    '/api/auth/register': {
      post: {
        summary: 'Register a new user',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                  role: { type: 'string', default: 'VIEWER' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'User created' } }
      }
    },
    '/api/auth/login': {
      post: {
        summary: 'Login user',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'Login successful' } }
      }
    },
    '/api/records': {
      get: {
        summary: 'Get all records',
        tags: ['Records'],
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'number' } },
          { name: 'limit', in: 'query', schema: { type: 'number' } },
          { name: 'type', in: 'query', schema: { type: 'string' } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'startDate', in: 'query', schema: { type: 'string' } },
          { name: 'endDate', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 
          200: { 
            description: 'List of records',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    data: { type: 'array', items: { type: 'object' } },
                    meta: { 
                      type: 'object',
                      properties: { total: { type: 'number' }, page: { type: 'number' }, limit: { type: 'number' }, totalPages: { type: 'number'} }
                    }
                  }
                }
              }
            }
          } 
        }
      },
      post: {
        summary: 'Create a record',
        tags: ['Records'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  amount: { type: 'number' },
                  type: { type: 'string' },
                  category: { type: 'string' },
                  date: { type: 'string', format: 'date-time' },
                  notes: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Record created' } }
      }
    },
    '/api/records/{id}': {
      put: {
        summary: 'Update a record',
        tags: ['Records'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  amount: { type: 'number' },
                  type: { type: 'string' },
                  category: { type: 'string' },
                  date: { type: 'string', format: 'date-time' },
                  notes: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'Record updated' } }
      },
      delete: {
        summary: 'Delete a record',
        tags: ['Records'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Record deleted' } }
      }
    },
    '/api/dashboard/summary': {
      get: {
        summary: 'Get dashboard summary',
        tags: ['Dashboard'],
        responses: { 200: { description: 'Dashboard summary' } }
      }
    }
  }
};

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
