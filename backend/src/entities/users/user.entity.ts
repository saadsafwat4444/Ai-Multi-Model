import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Chat } from '../chats/chats.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  refreshToken: string;

  @OneToMany(() => Chat, chat => chat.user)
  chats: Chat[];

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
