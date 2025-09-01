import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma';

let prismaInstance: PrismaClient;

@Injectable()
export class PrismaService {
  private prisma: PrismaClient;

  constructor() {
    if (!prismaInstance) {
      prismaInstance = new PrismaClient();
      // opcional: conectar de forma explícita
      prismaInstance.$connect().catch((e) => {
        console.error('Error connecting to DB', e);
      });
    }
    this.prisma = prismaInstance;
  }

  // getter para acceder al cliente
  get client(): PrismaClient {
    return this.prisma;
  }
}
