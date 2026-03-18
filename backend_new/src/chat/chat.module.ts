import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Chat } from '../entities/chats/chats.entity';
import { Message } from '../entities/messages/messages.entity';
import { ModelRouterService } from '../model-router/model-router.service';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Message])],
  controllers: [ChatController],
  providers: [ChatService, ModelRouterService],
})
export class ChatModule {}
