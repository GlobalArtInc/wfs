import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ErrorLoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, params, query, body, headers } = req;
    const userAgent = headers['user-agent'] || '';
    const ip = req.ip;

    return next.handle().pipe(
      catchError((err) => {
        const statusCode = err.status || 500;
        const message = err.message || 'Internal server error';

        this.logger.error(
          `Error: ${method} ${url} - Params: ${JSON.stringify(params)} - Query: ${JSON.stringify(query)} - ` +
            `Body: ${JSON.stringify(body)} - Headers: ${JSON.stringify(headers)} - IP: ${ip} - UA: ${userAgent} - ` +
            `Status: ${statusCode} - Message: ${message}`,
        );

        return throwError(() => err);
      }),
    );
  }
}
