import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data: T) => {
        // Solo aplicar el interceptor si la respuesta no es ya una ApiResponse
        // Esto evita que interfiera con respuestas que ya están formateadas
        if (data && typeof data === 'object' && 'status' in data) {
          return data as unknown as ApiResponse<T>;
        }

        return {
          status: 'success' as const,
          message: 'Operación exitosa',
          data,
        };
      }),
    );
  }
}
