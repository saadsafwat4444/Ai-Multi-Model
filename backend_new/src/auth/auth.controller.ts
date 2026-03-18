import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  async googleLogin(@Body() body: { token: string }) {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${body.token}`,
        },
      });

      const googleUser = await response.json();
      return this.authService.handleGoogleLogin(googleUser);
    } catch (error) {
      throw new Error('Invalid Google token');
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request) {
    const user = (req as any).user;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout() {
    return { message: 'Logged out successfully' };
  }
}
