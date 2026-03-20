import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import * as jwt from 'jsonwebtoken';
import { UsersService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  private oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  getGoogleOAuthUrl(): string {
    const scopes = ['profile', 'email'];
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
    });
  }

  async loginWithGoogle(code: string) {
    console.log('=== AuthService.loginWithGoogle ===');
    console.log('Step 1: Getting tokens from Google...');
    
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    
    console.log('Step 2: Got tokens, getting user info...');

    const oauth2 = google.oauth2({ auth: this.oauth2Client, version: 'v2' });
    const { data } = await oauth2.userinfo.get();
    
    console.log('Step 3: Got user info:', data.name, data.email);

    // استخدم UsersService عشان نضيف المستخدم في الداتابيز
    console.log('Step 4: Finding or creating user in database...');
    const user = await this.usersService.findOrCreateGoogleUser(data);
    
    console.log('Step 5: User saved/updated:', user.id, user.name);

    console.log('Step 6: Generating JWT token...');
    const token = jwt.sign(
      { userId: user.id, email: user.email,   avatar: user.avatar,name:user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('Step 7: JWT token generated successfully');
    return { user, token };
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}