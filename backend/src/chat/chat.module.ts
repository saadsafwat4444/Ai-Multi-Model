import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ModelRouterService } from '../model-router/model-router.service';
import { GeminiService } from '../gemini/gemini.service';
import { User } from '../entities/users/user.entity';
import { Chat } from '../entities/chats/chats.entity';
import { Message } from '../entities/messages/messages.entity';
import { GptService } from '@/gpt/gpt.service';
import { GrokService } from '@/grok/grok.service';
 

@Module({
  imports: [TypeOrmModule.forFeature([User, Chat, Message])],
  controllers: [ChatController],
  providers: [ChatService, ModelRouterService, GeminiService,GptService,GrokService],
})
export class ChatModule {} 