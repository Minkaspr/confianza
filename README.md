<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Descripción

Este proyecto utiliza [NestJS](https://nestjs.com) como framework para construir un backend eficiente y escalable con TypeScript. Incluye integración con **Prisma** para la base de datos, JWT para autenticación y validación de datos con Zod.

## Configuración del proyecto

```bash
# Instalar dependencias
npm install
# o
yarn install
```

## Compilar y ejecutar

```bash
# Modo desarrollo
npm run start:dev

# Modo producción
npm run start:prod

# Ejecución normal
npm run start
```

## Comandos comunes de NestJS

NestJS incluye CLI muy útil para generar rápidamente componentes del proyecto. Algunos de los más usados:

```bash
# Crear un módulo
nest generate module nombre-modulo
# o
nest g mo nombre-modulo

# Crear un controlador
nest generate controller nombre-controlador
# o
nest g co nombre-controlador

# Crear un servicio
nest generate service nombre-servicio
# o
nest g s nombre-servicio

# Crear un guard
nest generate guard nombre-guard
# o
nest g gu nombre-guard

# Crear un interceptor
nest generate interceptor nombre-interceptor
# o
nest g in nombre-interceptor

# Crear un pipe
nest generate pipe nombre-pipe
# o
nest g pi nombre-pipe
```

> Tip: Usa `--flat` para generar sin carpeta, y `--no-spec` si no quieres archivos de prueba (`.spec.ts`).

## Pruebas

```bash
# Pruebas unitarias
npm run test

# Pruebas e2e
npm run test:e2e

# Cobertura de pruebas
npm run test:cov
```

## Despliegue

Para desplegar tu aplicación NestJS a producción, revisa la documentación oficial: [Deployment](https://docs.nestjs.com/).

Si quieres desplegar en la nube de manera sencilla con NestJS Mau:

```bash
npm install -g @nestjs/mau
mau deploy
```

## Recursos

* [Documentación oficial de NestJS](https://docs.nestjs.com)
* [Discord de soporte](https://discord.gg/G7Qnnhy)
* [Cursos oficiales NestJS](https://courses.nestjs.com)
* [NestJS Devtools](https://devtools.nestjs.com)

## Licencia

NestJS es un proyecto open source bajo licencia MIT.
