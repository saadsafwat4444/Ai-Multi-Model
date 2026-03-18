import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { User } from './entities/users/user.entity';
import { Chat } from './entities/chats/chats.entity';
import { Message } from './entities/messages/messages.entity';
import { GeminiService } from './gemini/gemini.service';
import { GptService } from './gpt/gpt.service';
import { GrokService } from './grok/grok.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'ai_chat',
      entities: [User, Chat, Message],
      synchronize: true,
    }),
    AuthModule,
    ChatModule,
  ],
  providers: [GeminiService, GptService, GrokService],
})
export class AppModule {}
