import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiResponse,
  ApiFieldError,
} from '../interfaces/api-response.interface';

interface ValidationExceptionResponse {
  message: string | string[];
  error?: string;
  statusCode?: number;
  errors?: ApiFieldError[]; // Agregar esta propiedad
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let httpStatus: HttpStatus;
    let message: string;
    let errors: ApiFieldError[] = [];

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as ValidationExceptionResponse;
        // Verificar si tenemos errores personalizados del ValidationPipe
        if (responseObj.errors && Array.isArray(responseObj.errors)) {
          message = 'Error de validación';
          errors = responseObj.errors;
        }
        // Manejar errores de validación estándar de class-validator
        else if (Array.isArray(responseObj.message)) {
          message = 'Error de validación';
          errors = responseObj.message.map((msg: string) => ({
            field: 'validation',
            message: msg,
          }));
        }
        // Mensaje simple
        else {
          message = responseObj.message || exception.message;
        }
      } else {
        message = String(exceptionResponse);
      }
    } else {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Error interno del servidor';
      this.logger.error('[ERROR] Error interno del servidor:', exception);
    }

    // La respuesta siempre sigue el formato ApiResponse
    const apiResponse: ApiResponse<null> = {
      status: 'error',
      message,
      ...(errors.length > 0 && { errors }),
    };

    response.status(httpStatus).json(apiResponse);
  }
}
