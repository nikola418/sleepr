import {
  AuthServiceController,
  AuthServiceControllerMethods,
  CurrentUser,
} from '@app/common';
import { UserDocument } from '@app/common/models';
import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
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

  @UseGuards(JwtAuthGuard)
  authenticate(@Payload() data: any) {
    return {
      ...data.user,
      id: data.user._id,
    };
  }
}
