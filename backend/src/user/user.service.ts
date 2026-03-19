import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/users/user.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async findOrCreateGoogleUser(googleUser: any) {

    let user = await this.userRepo.findOne({
      where: { email: googleUser.email },
    });

    if (!user) {
      user = this.userRepo.create({
        name: googleUser.name,
        email: googleUser.email,
        avatar: googleUser.picture,
      });

      await this.userRepo.save(user);
    }

    return user;
  }

  async findById(id: number) {
    return await this.userRepo.findOne({
      where: { id }
    });
  }
}