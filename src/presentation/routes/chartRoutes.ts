import { Router } from 'express';
import { ChartController } from '../controllers/ChartController';
import { validateRequest } from '../middlewares/validateRequest';
import { chartParamsSchema, chartQuerySchema } from '../dtos/ChartRequestDto';

/**
 * @swagger
 * /charts/{chartType}:
 *   get:
 *     summary: Obter dados para gráfico do dashboard
 *     description: |
 *       Retorna dados de transações agregados e formatados para o tipo de gráfico solicitado,
 *       filtrados pelo período de datas informado.
 *
 *       **Comportamento por tipo de gráfico:**
 *
 *       - **pie**: Agrupa as transações por categoria e retorna o total de cada uma.
 *         Retorna `labels` (nomes das categorias) e `values` (soma dos valores).
 *
 *       - **bar**: Mesmo agrupamento do `pie`, mas no formato de `datasets`
 *         (compatível com bibliotecas como Chart.js).
 *
 *       - **line**: Retorna série temporal. `labels` são as datas do período e
 *         `datasets` contém uma série por categoria com os valores diários.
 *         Dias sem transações para uma categoria retornam valor `0`.
 *
 *       - **area**: Mesmo formato e dados do `line` (a diferença entre ambos é
 *         apenas visual no frontend).
 *
 *       **Regras de validação:**
 *
 *       - `chartType` deve ser um dos tipos suportados: `pie`, `line`, `bar`, `area`
 *       - `startDate` e `endDate` são obrigatórios e devem estar no formato `YYYY-MM-DD`
 *       - `startDate` deve ser anterior ou igual a `endDate`
 *       - Caso não existam transações no período, os arrays retornados serão vazios
 *     tags: [Charts]
 *     parameters:
 *       - in: path
 *         name: chartType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pie, line, bar, area]
 *         description: |
 *           Tipo de gráfico desejado.
 *           Cada tipo retorna os dados em um formato diferente.
 *         examples:
 *           pie:
 *             summary: Gráfico de pizza
 *             value: pie
 *           line:
 *             summary: Gráfico de linhas
 *             value: line
 *           bar:
 *             summary: Gráfico de barras
 *             value: bar
 *           area:
 *             summary: Gráfico de área
 *             value: area
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de início do período (formato YYYY-MM-DD). Deve ser anterior ou igual a endDate.
 *         example: "2025-01-01"
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de fim do período (formato YYYY-MM-DD). Deve ser posterior ou igual a startDate.
 *         example: "2025-12-31"
 *     responses:
 *       200:
 *         description: Dados do gráfico retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/PieChartResponse'
 *                 - $ref: '#/components/schemas/BarChartResponse'
 *                 - $ref: '#/components/schemas/LineChartResponse'
 *                 - $ref: '#/components/schemas/AreaChartResponse'
 *             examples:
 *               pie:
 *                 summary: Resposta para gráfico de pizza
 *                 value:
 *                   data:
 *                     labels: ["Electronics", "Clothing", "Food & Beverages", "Home & Garden", "Sports", "Books"]
 *                     values: [125430.50, 48120.00, 22530.75, 61200.30, 35890.00, 12450.25]
 *                   meta:
 *                     startDate: "2025-01-01"
 *                     endDate: "2025-12-31"
 *                     chartType: "pie"
 *               bar:
 *                 summary: Resposta para gráfico de barras
 *                 value:
 *                   data:
 *                     labels: ["Electronics", "Clothing", "Food & Beverages"]
 *                     datasets:
 *                       - label: "Total Amount"
 *                         values: [125430.50, 48120.00, 22530.75]
 *                   meta:
 *                     startDate: "2025-01-01"
 *                     endDate: "2025-12-31"
 *                     chartType: "bar"
 *               line:
 *                 summary: Resposta para gráfico de linhas
 *                 value:
 *                   data:
 *                     labels: ["2025-01-01", "2025-01-02", "2025-01-03"]
 *                     datasets:
 *                       - label: "Electronics"
 *                         values: [1520.00, 980.50, 2100.00]
 *                       - label: "Clothing"
 *                         values: [340.00, 0, 520.75]
 *                       - label: "Food & Beverages"
 *                         values: [65.50, 120.00, 45.00]
 *                   meta:
 *                     startDate: "2025-01-01"
 *                     endDate: "2025-01-03"
 *                     chartType: "line"
 *               area:
 *                 summary: Resposta para gráfico de área (mesmo formato de line)
 *                 value:
 *                   data:
 *                     labels: ["2025-01-01", "2025-01-02", "2025-01-03"]
 *                     datasets:
 *                       - label: "Electronics"
 *                         values: [1520.00, 980.50, 2100.00]
 *                       - label: "Clothing"
 *                         values: [340.00, 0, 520.75]
 *                   meta:
 *                     startDate: "2025-01-01"
 *                     endDate: "2025-01-03"
 *                     chartType: "area"
 *               empty:
 *                 summary: Resposta quando não há dados no período
 *                 value:
 *                   data:
 *                     labels: []
 *                     values: []
 *                   meta:
 *                     startDate: "2030-01-01"
 *                     endDate: "2030-12-31"
 *                     chartType: "pie"
 *       400:
 *         description: |
 *           Erro de validação. Possíveis causas:
 *
 *           - **Tipo de gráfico inválido**: `chartType` não é `pie`, `line`, `bar` ou `area`
 *           - **startDate ausente**: parâmetro `startDate` não foi informado
 *           - **endDate ausente**: parâmetro `endDate` não foi informado
 *           - **Formato de data inválido**: data não está no formato `YYYY-MM-DD`
 *           - **Intervalo inválido**: `startDate` é posterior a `endDate`
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             examples:
 *               invalidChartType:
 *                 summary: Tipo de gráfico inválido
 *                 value:
 *                   error:
 *                     message: "Invalid chart type. Supported types: pie, line, bar, area"
 *                     code: "VALIDATION_ERROR"
 *               missingStartDate:
 *                 summary: startDate ausente
 *                 value:
 *                   error:
 *                     message: "startDate is required"
 *                     code: "VALIDATION_ERROR"
 *               missingEndDate:
 *                 summary: endDate ausente
 *                 value:
 *                   error:
 *                     message: "endDate is required"
 *                     code: "VALIDATION_ERROR"
 *               invalidDateFormat:
 *                 summary: Formato de data inválido
 *                 value:
 *                   error:
 *                     message: "startDate must be in YYYY-MM-DD format"
 *                     code: "VALIDATION_ERROR"
 *               invalidDateRange:
 *                 summary: startDate posterior a endDate
 *                 value:
 *                   error:
 *                     message: "startDate must be before or equal to endDate"
 *                     code: "VALIDATION_ERROR"
 *       500:
 *         description: Erro interno do servidor (ex. falha na conexão com o banco de dados)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalError'
 *             example:
 *               error:
 *                 message: "Internal server error"
 *                 code: "INTERNAL_ERROR"
 */
export function createChartRoutes(controller: ChartController): Router {
  const router = Router();

  router.get(
    '/:chartType',
    validateRequest(chartParamsSchema, 'params'),
    validateRequest(chartQuerySchema, 'query'),
    (req, res, next) => controller.getChartData(req, res, next)
  );

  return router;
}
