import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Registrar el filtro globalmente
  app.useGlobalFilters(new HttpExceptionFilter());

  // Configurar ValidationPipe global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remueve propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades no permitidas
      transform: true, // Transforma automáticamente los tipos
      disableErrorMessages: false, // Mantiene los mensajes de error
      exceptionFactory: (errors) => {
        // Crear errores formateados específicos por campo
        const formattedErrors = errors.flatMap((error) => {
          const constraints = error.constraints;
          if (!constraints) {
            return [
              {
                field: error.property || 'unknown',
                message: 'Error de validación',
              },
            ];
          }

          return Object.values(constraints).map((message) => ({
            field: error.property || 'unknown',
            message: String(message),
          }));
        });

        return new BadRequestException({
          message: 'Error de validación',
          errors: formattedErrors,
        });
      },
    }),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API de ConfianzaLFE')
    .setDescription('Documentación de la API de ConfianzaLFE')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  // Configuración de CORS
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
  ];

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
  console.error('Error al iniciar la aplicación', err);
  process.exit(1);
});
