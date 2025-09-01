import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('test')
export class TestController {
  // Ruta pública
  @Get('public')
  getPublic() {
    return { message: 'Ruta pública, no necesita token' };
  }

  // Ruta protegida
  @UseGuards(AuthGuard('jwt'))
  @Get('protected')
  getProtected() {
    return {
      message: 'Ruta protegida, token válido!',
      data: 'datos del usuario del token',
    };
  }
}
