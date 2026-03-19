import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
 
import { User } from 'src/entities/users/user.entity';
import { UsersService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  exports: [UsersService], // 🔥 مهم عشان تستخدمه برا
})
export class UsersModule {}