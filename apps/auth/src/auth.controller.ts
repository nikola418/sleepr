import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from '@app/common';
import { LocalAuthGuard } from './guards';
import { UserDocument } from './users/models';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, expires } = this.authService.login(user);
    res.cookie('Authentication', token, { httpOnly: true, expires });

    return token;
  }

  @MessagePattern('authenticate')
  @UseGuards(JwtAuthGuard)
  async authenticate(@Payload() data: any) {
    return data.user;
  }
}
