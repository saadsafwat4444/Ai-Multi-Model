import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/users/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async handleGoogleLogin(googleUser: any) {
    const { id, email, name, picture } = googleUser;

    let user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      user.googleId = id;
      user.avatar = picture;
      await this.userRepository.save(user);
    } else {
      const newUser = this.userRepository.create({
        name,
        email,
        googleId: id,
        avatar: picture,
      });

      user = await this.userRepository.save(newUser);
    }

    const jwtToken = this.jwtService.sign(
      { userId: user.id, email: user.email },
      { expiresIn: '1d' }
    );

    return {
      access_token: jwtToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    };
  }

  async validateUser(payload: any) {
    const user = await this.userRepository.findOne({ where: { id: payload.userId } });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
