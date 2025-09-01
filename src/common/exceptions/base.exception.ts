import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseHttpException extends HttpException {
  constructor(message: string, statusCode: HttpStatus) {
    super(message, statusCode);
  }
}

export class BadRequestException extends BaseHttpException {
  constructor(message = 'Solicitud incorrecta') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class UnauthorizedException extends BaseHttpException {
  constructor(message = 'No autorizado') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class ForbiddenException extends BaseHttpException {
  constructor(message = 'Acceso prohibido') {
    super(message, HttpStatus.FORBIDDEN);
  }
}

export class ResourceNotFoundException extends BaseHttpException {
  constructor(message = 'Recurso no encontrado') {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class DuplicateResourceException extends BaseHttpException {
  constructor(message = 'Recurso duplicado') {
    super(message, HttpStatus.CONFLICT);
  }
}
