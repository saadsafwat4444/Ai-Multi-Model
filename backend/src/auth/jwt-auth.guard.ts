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

    console.log("Cookies in request:", req.cookies);

    // نجيب التوكن من الكوكيز
    const token = req.cookies['token'];

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