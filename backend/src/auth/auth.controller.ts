import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthLoginDto } from './dto/auth-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: AuthCredentialsDto })
  @Post('signup')
  signup(@Body() credentials: AuthCredentialsDto) {
    return this.authService.signup(credentials);
  }

  @ApiBody({ type: AuthLoginDto })
  @Post('login')
  login(@Body() loginCredentials: AuthLoginDto) {
    return this.authService.login(loginCredentials);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Request() req: any) {
    return req.user;
  }
}
