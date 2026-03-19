import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dynamic Dashboard API',
      version: '1.0.0',
      description:
        'RESTful API for serving dynamic dashboard chart data. Supports pie, line, bar, and area charts with mandatory date filtering.',
    },
    servers: [
      {
        url: '/api/v1',
        description: 'API v1',
      },
    ],
    components: {
      schemas: {
        ChartResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                labels: {
                  type: 'array',
                  items: { type: 'string' },
                },
                values: {
                  type: 'array',
                  items: { type: 'number' },
                  description: 'Present for pie charts',
                },
                datasets: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      label: { type: 'string' },
                      values: {
                        type: 'array',
                        items: { type: 'number' },
                      },
                    },
                  },
                  description: 'Present for line, bar, and area charts',
                },
              },
            },
            meta: {
              type: 'object',
              properties: {
                startDate: { type: 'string', format: 'date' },
                endDate: { type: 'string', format: 'date' },
                chartType: { type: 'string', enum: ['pie', 'line', 'bar', 'area'] },
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                message: { type: 'string' },
                code: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/presentation/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
