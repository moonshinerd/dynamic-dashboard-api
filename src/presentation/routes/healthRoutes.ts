import { Router } from 'express';
import { HealthController } from '../controllers/HealthController';

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Returns the API health status.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
export function createHealthRoutes(controller: HealthController): Router {
  const router = Router();

  router.get('/', (req, res) => controller.getHealth(req, res));

  return router;
}
