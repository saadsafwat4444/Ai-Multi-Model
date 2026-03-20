import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: { userId: number };
    }
  }
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();

    // First try Authorization header (from localStorage)
    const authHeader = req.headers['authorization'];
    let token = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
      console.log("Token from Authorization header:", !!token);
    } else {
      // Fallback to cookies (for backward compatibility)
      token = req.cookies?.['token'];
      console.log("Token from cookies:", !!token);
    }

    if (!token) {
      throw new UnauthorizedException('No token found'); // لو مفيش توكن → رفض الوصول
    }

    try {
      // نتحقق من صلاحية التوكن
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };

      // نحط الـ payload في req.user عشان نستعمله في controller
      req.user = payload;

      return true; // السماح بالوصول
    } catch (err) {
      throw new UnauthorizedException('Invalid token'); // لو التوكن غير صالح
    }
  }
}