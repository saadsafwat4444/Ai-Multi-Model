import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '../entities/chats/chats.entity';
import { Message } from '../entities/messages/messages.entity';
import { ModelRouterService } from '../model-router/model-router.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly modelRouterService: ModelRouterService,
  ) {}

  async sendMessage(chatId: string | null, model: string, message: string, userId: number) {
    let chat: Chat;

    if (chatId) {
      chat = await this.chatRepository.findOne({ where: { id: chatId, userId } });
      if (!chat) {
        throw new Error('Chat not found');
      }
    } else {
      chat = this.chatRepository.create({
        userId,
        title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        model,
      });
      chat = await this.chatRepository.save(chat);
    }

    const userMessage = this.messageRepository.create({
      chatId: chat.id,
      role: 'user',
      content: message,
    });
    await this.messageRepository.save(userMessage);

    try {
      const aiResponse = await this.modelRouterService.sendMessage(model, message);
      
      const aiMessage = this.messageRepository.create({
        chatId: chat.id,
        role: 'assistant',
        content: aiResponse,
      });
      await this.messageRepository.save(aiMessage);

      return {
        userMessage: {
          chat: chat,
          content: message,
        },
        aiMessage: {
          content: aiResponse,
          success: true,
        },
      };
    } catch (error) {
      const errorMessage = this.messageRepository.create({
        chatId: chat.id,
        role: 'assistant',
        content: 'Error: Could not get response from AI.',
      });
      await this.messageRepository.save(errorMessage);

      return {
        userMessage: {
          chat: chat,
          content: message,
        },
        aiMessage: {
          content: 'Error: Could not get response from AI.',
          success: false,
        },
      };
    }
  }

  async getChatHistory(userId: number) {
    const chats = await this.chatRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    
    return chats.map(chat => ({
      id: chat.id,
      title: chat.title,
      model: chat.model,
      createdAt: chat.createdAt,
    }));
  }

  async getChatMessages(chatId: string, userId: number) {
    const chat = await this.chatRepository.findOne({ where: { id: chatId, userId } });
    if (!chat) {
      throw new Error('Chat not found');
    }

    const messages = await this.messageRepository.find({
      where: { chatId },
      order: { createdAt: 'ASC' },
    });

    return messages;
  }

  async deleteChat(chatId: string, userId: number) {
    const chat = await this.chatRepository.findOne({ where: { id: chatId, userId } });
    if (!chat) {
      throw new Error('Chat not found');
    }

    await this.messageRepository.delete({ chatId });
    await this.chatRepository.delete(chatId);

    return { success: true };
  }
}
