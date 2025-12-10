import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { HttpRequest, HttpResponse } from './interceptor.types';

@Injectable()
export class ResponseTimeInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startedAt = Date.now();
    const http = context.switchToHttp();

    const request = http.getRequest<HttpRequest>();
    const response = http.getResponse<HttpResponse>();

    const method = request.method ?? 'UNKNOWN';
    const url = request.url ?? 'UNKNOWN';

    return next.handle().pipe(
      tap(() => {
        const statusCode = response.statusCode ?? 200;
        const durationMs = Date.now() - startedAt;

        this.logger.log(`${method} ${url} ${statusCode} +${durationMs}ms`);
      }),
    );
  }
}
