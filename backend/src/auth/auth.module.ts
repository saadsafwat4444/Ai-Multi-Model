import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../entities/users/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    UsersModule, // 🔥 مهم عشان نستخدم UsersService
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
