import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dynamic Dashboard API',
      version: '1.0.0',
      description:
        'API RESTful dinâmica para servir dados de dashboard. Suporta gráficos de pizza, linha, barra e área, com filtro obrigatório por período de datas.\n\n' +
        '## Tipos de gráfico\n\n' +
        '| Tipo | Descrição | Formato |\n' +
        '|------|-----------|--------|\n' +
        '| `pie` | Gráfico de pizza | `labels` + `values` (totais por categoria) |\n' +
        '| `bar` | Gráfico de barras | `labels` + `datasets` (totais por categoria) |\n' +
        '| `line` | Gráfico de linhas | `labels` (datas) + `datasets` (série temporal por categoria) |\n' +
        '| `area` | Gráfico de área | Mesmo formato de `line` |\n\n' +
        '## Envelope de resposta\n\n' +
        'Toda resposta de sucesso segue o formato `{ data, meta }`. ' +
        'O campo `data` contém os dados do gráfico e `meta` contém os filtros aplicados.\n\n' +
        '## Erros\n\n' +
        'Erros seguem o formato `{ error: { message, code } }` com o HTTP status code correspondente.',
    },
    servers: [
      {
        url: '/api/v1',
        description: 'API v1',
      },
    ],
    components: {
      schemas: {
        PieChartResponse: {
          type: 'object',
          description: 'Resposta para gráfico de pizza. Agrupa transações por categoria e retorna o total de cada uma.',
          properties: {
            data: {
              type: 'object',
              properties: {
                labels: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Nomes das categorias',
                  example: ['Electronics', 'Clothing', 'Food & Beverages', 'Home & Garden', 'Sports', 'Books'],
                },
                values: {
                  type: 'array',
                  items: { type: 'number' },
                  description: 'Soma total do valor (amount) de cada categoria no período',
                  example: [125430.5, 48120.0, 22530.75, 61200.3, 35890.0, 12450.25],
                },
              },
            },
            meta: { $ref: '#/components/schemas/Meta' },
          },
        },
        BarChartResponse: {
          type: 'object',
          description: 'Resposta para gráfico de barras. Agrupa transações por categoria com formato de datasets.',
          properties: {
            data: {
              type: 'object',
              properties: {
                labels: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Nomes das categorias',
                  example: ['Electronics', 'Clothing', 'Food & Beverages', 'Home & Garden', 'Sports', 'Books'],
                },
                datasets: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Dataset' },
                  description: 'Array com um dataset contendo os totais por categoria',
                  example: [
                    {
                      label: 'Total Amount',
                      values: [125430.5, 48120.0, 22530.75, 61200.3, 35890.0, 12450.25],
                    },
                  ],
                },
              },
            },
            meta: { $ref: '#/components/schemas/Meta' },
          },
        },
        LineChartResponse: {
          type: 'object',
          description: 'Resposta para gráfico de linhas. Retorna série temporal com um dataset por categoria.',
          properties: {
            data: {
              type: 'object',
              properties: {
                labels: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Datas no formato YYYY-MM-DD (ordenadas cronologicamente)',
                  example: ['2025-01-01', '2025-01-02', '2025-01-03'],
                },
                datasets: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Dataset' },
                  description: 'Um dataset por categoria, com os valores diários correspondentes a cada data em labels',
                  example: [
                    { label: 'Electronics', values: [1520.0, 980.5, 2100.0] },
                    { label: 'Clothing', values: [340.0, 0, 520.75] },
                    { label: 'Food & Beverages', values: [65.5, 120.0, 45.0] },
                  ],
                },
              },
            },
            meta: { $ref: '#/components/schemas/Meta' },
          },
        },
        AreaChartResponse: {
          type: 'object',
          description: 'Resposta para gráfico de área. Mesmo formato do gráfico de linhas (a diferença é visual no frontend).',
          properties: {
            data: {
              type: 'object',
              properties: {
                labels: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Datas no formato YYYY-MM-DD (ordenadas cronologicamente)',
                  example: ['2025-01-01', '2025-01-02', '2025-01-03'],
                },
                datasets: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Dataset' },
                  description: 'Um dataset por categoria, com os valores diários correspondentes a cada data em labels',
                  example: [
                    { label: 'Electronics', values: [1520.0, 980.5, 2100.0] },
                    { label: 'Clothing', values: [340.0, 0, 520.75] },
                  ],
                },
              },
            },
            meta: { $ref: '#/components/schemas/Meta' },
          },
        },
        Dataset: {
          type: 'object',
          description: 'Um conjunto de dados nomeado, representando uma série no gráfico',
          properties: {
            label: {
              type: 'string',
              description: 'Nome da série (categoria ou descrição)',
              example: 'Electronics',
            },
            values: {
              type: 'array',
              items: { type: 'number' },
              description: 'Valores numéricos correspondentes a cada label do gráfico',
              example: [1520.0, 980.5, 2100.0],
            },
          },
          required: ['label', 'values'],
        },
        Meta: {
          type: 'object',
          description: 'Metadados da requisição com os filtros aplicados',
          properties: {
            startDate: {
              type: 'string',
              format: 'date',
              description: 'Data de início do filtro aplicado',
              example: '2025-01-01',
            },
            endDate: {
              type: 'string',
              format: 'date',
              description: 'Data de fim do filtro aplicado',
              example: '2025-12-31',
            },
            chartType: {
              type: 'string',
              enum: ['pie', 'line', 'bar', 'area'],
              description: 'Tipo de gráfico solicitado',
              example: 'pie',
            },
          },
          required: ['startDate', 'endDate', 'chartType'],
        },
        ValidationError: {
          type: 'object',
          description: 'Erro de validação dos parâmetros da requisição',
          properties: {
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: 'Descrição do(s) erro(s) de validação',
                },
                code: {
                  type: 'string',
                  enum: ['VALIDATION_ERROR'],
                  example: 'VALIDATION_ERROR',
                },
              },
            },
          },
        },
        InvalidChartTypeError: {
          type: 'object',
          description: 'Erro quando o tipo de gráfico não é suportado',
          properties: {
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Invalid chart type. Supported types: pie, line, bar, area',
                },
                code: {
                  type: 'string',
                  enum: ['VALIDATION_ERROR'],
                  example: 'VALIDATION_ERROR',
                },
              },
            },
          },
        },
        InternalError: {
          type: 'object',
          description: 'Erro interno do servidor',
          properties: {
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Internal server error',
                },
                code: {
                  type: 'string',
                  enum: ['INTERNAL_ERROR'],
                  example: 'INTERNAL_ERROR',
                },
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
