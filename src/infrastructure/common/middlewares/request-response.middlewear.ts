// src/infrastructure/utils/middlewares/request-response.middleware.ts
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, headers, body } = req;

    this.logger.log(`\n=== Incoming Request ===`);
    console.log(`Method: ${method}`);
    console.log(`Path: ${originalUrl}`);
    console.log(`Headers: ${JSON.stringify(headers, null, 2)}`);
    console.log(`Body: ${JSON.stringify(body, null, 2)}`);

    // Log response when finished
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      this.logger.log(`\n=== Response ===`);
      console.log(`Duration: ${duration} ms`);
      console.log(`Status: ${res.statusCode}`);
    });

    next();
  }
}
