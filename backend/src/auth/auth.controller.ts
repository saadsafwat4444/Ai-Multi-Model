import { Controller, Get, Res, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  // Get current user data
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Req() req) {
    const userId = req.user.userId;
    const user = await this.usersService.findById(userId);
    return { user };
  }

  // هذا المسار الأساسي الذي يفتح Google OAuth
  @Get('google')
  googleAuth(@Res() res: Response) {
    const url = this.authService.getGoogleOAuthUrl();
    return res.redirect(url);
  }

  // هذا المسار الذي يستقبل callback بعد تسجيل الدخول في Google
  @Get('google/callback')
  async googleCallback(@Query('code') code: string, @Res() res: Response) {
    console.log('=== Google OAuth Callback ===');
    console.log('Received code:', code ? 'yes' : 'no');
    
    if (!code) {
      console.log('No code provided in callback');
      return res.status(400).send('No code provided');
    }

    try {
      console.log('Attempting to login with Google...');
      const { user, token } = await this.authService.loginWithGoogle(code);
      
      console.log('Google login successful');
      console.log('User:', user.name, user.email);
      console.log('Token generated:', token ? 'yes' : 'no');

    res.cookie('token', token, {
  httpOnly: true,
  secure: true,          // 🔥 مهم
  sameSite: 'none',      // 🔥 مهم عشان cross-site
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
  domain: '.vercel.app'  // 🔥 مهم عشان cross-origin
});

      console.log('Token set in cookie:', token ? 'yes' : 'no');
      console.log('Cookie settings:', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
        domain: '.vercel.app'
      });
      console.log('Redirecting to dashboard...');

  return res.redirect('https://ai-multi-model-eta.vercel.app/dashboard');
    } catch (error) {
      console.error('Google login error:', error);
      return res.status(500).send('Google Auth Failed');
    }
  }
}