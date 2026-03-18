import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Message } from '../messages/messages.entity';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  model: string;

  @ManyToOne(() => User, user => user.chats)
  user: User;

  @Column()
  userId: number;

  @OneToMany(() => Message, message => message.chat)
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
