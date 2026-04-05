import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, query, body } = req;
    const start = Date.now();

    res.on('finish', () => {
      const ms = Date.now() - start;
      this.logger.log(
        `${method} ${originalUrl} → ${res.statusCode} (${ms}ms)`,
      );
      if (Object.keys(query).length) {
        this.logger.debug(`  query: ${JSON.stringify(query)}`);
      }
      if (method !== 'GET' && Object.keys(body || {}).length) {
        const safe = { ...body };
        if (safe.password) safe.password = '***';
        this.logger.debug(`  body:  ${JSON.stringify(safe)}`);
      }
    });

    next();
  }
}
