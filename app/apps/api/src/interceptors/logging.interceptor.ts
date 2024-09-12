import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, params, query, body, headers } = req;
    const userAgent = headers['user-agent'] || '';
    const ip = req.ip;

    const now = Date.now();

    return next.handle().pipe(
      tap((responseData) => {
        const res = context.switchToHttp().getResponse();
        const { statusCode } = res;
        const contentLength = res.get('content-length');
        const responseTime = Date.now() - now;

        this.logger.log(
          `Request: ${method} ${url} - Params: ${JSON.stringify(params)} - Query: ${JSON.stringify(query)} - ` +
          `Body: ${JSON.stringify(body)} - Headers: ${JSON.stringify(headers)} - IP: ${ip} - UA: ${userAgent}`
        );

        this.logger.log(
          `Response: ${statusCode} ${contentLength ? `${contentLength}b` : ''} - Time: ${responseTime}ms - ` +
          `Data: ${JSON.stringify(responseData).slice(0, 1024)}`
        );
      }),
    );
  }
}
