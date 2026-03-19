// src/chat/chat.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '../entities/chats/chats.entity';
import { Message } from '../entities/messages/messages.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepo: Repository<Chat>,
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
  ) {}

  // إنشاء أو إيجاد الشات
  async findOrCreateChat(
    userId: number,
    chatId: string | null,
    model: string,
    initialMessage: string,
  ): Promise<Chat> {
    console.log(`findOrCreateChat: userId=${userId}, chatId=${chatId}, model=${model}`);
    
    if (chatId) {
      console.log(`Looking for existing chat with ID: ${chatId}`);
      const existing = await this.chatRepo.findOne({
        where: { id: chatId, userId },
        relations: ['messages'],
      });
      if (existing) {
        console.log(`Found existing chat: ${existing.id} with ${existing.messages?.length || 0} messages`);
        return existing;
      } else {
        console.log(`No existing chat found with ID: ${chatId}`);
      }
    }

    console.log(`Creating new chat for user ${userId} with model ${model}`);
    const title = initialMessage.length > 30 
      ? initialMessage.substring(0, 30) + '...'
      : initialMessage;

    const newChat = this.chatRepo.create({
      id: chatId || `chat_${Date.now()}`,
      userId,
      model,
      title,
    });

    const savedChat = await this.chatRepo.save(newChat);
    console.log(`Created new chat with ID: ${savedChat.id}`);
    return savedChat;
  }

  // حفظ رسالة
  async addMessage(chatId: string, sender: 'user' | 'assistant', content: string, model: string): Promise<Message> {
    const chat = await this.chatRepo.findOne({ where: { id: chatId } });
    if (!chat) throw new Error('Chat not found');

    const message = this.messageRepo.create({
      chatId,
      content,
      role: sender === 'user' ? 'user' : 'assistant',
    });

    const savedMessage = await this.messageRepo.save(message);
    
    // Return message with chat relation
    return await this.messageRepo.findOne({
      where: { id: savedMessage.id },
      relations: ['chat']
    }) || savedMessage;
  }

  // جلب كل الشاتس الخاصة بمستخدم
  async getUserChats(userId: number, model?: string): Promise<Chat[]> {
    const where: any = { userId };
    if (model) where.model = model;

    return await this.chatRepo.find({
      where,
      relations: ['messages'],
      order: { createdAt: 'DESC' },
    });
  }

  // جلب كل الرسائل لشات معين
  async getChatMessages(chatId: string): Promise<Message[]> {
    const messages = await this.messageRepo.find({
      where: { chatId },
      order: { createdAt: 'ASC' }, // ترتيب تصاعدي لعرض الرسائل بالترتيب الزمني
    });
    
    if (!messages || messages.length === 0) {
      throw new Error('No messages found for this chat');
    }
    
    return messages;
  }

  // حذف شات وكل رسائله
  async deleteChat(chatId: string, userId: number): Promise<void> {
    console.log(`Deleting chat ${chatId} for user ${userId}`);
    
    // التأكد إن الشات تابع للمستخدم
    const chat = await this.chatRepo.findOne({
      where: { id: chatId, userId }
    });
    
    if (!chat) {
      throw new Error('Chat not found or you do not have permission to delete it');
    }

    // حذف كل الرسائل المتعلقة بالشات
    await this.messageRepo.delete({ chatId });
    
    // حذف الشات نفسه
    await this.chatRepo.delete({ id: chatId });
    
    console.log(`Successfully deleted chat ${chatId}`);
  }

  // تحديث عنوان الشات
  async updateChatTitle(chatId: string, userId: number, newTitle: string): Promise<void> {
    console.log(`Updating title for chat ${chatId} for user ${userId}`);
    
    // التأكد إن الشات تابع للمستخدم
    const chat = await this.chatRepo.findOne({
      where: { id: chatId, userId }
    });
    
    if (!chat) {
      throw new Error('Chat not found or you do not have permission to edit it');
    }

    // تحديث العنوان
    chat.title = newTitle.trim();
    await this.chatRepo.save(chat);
    
    console.log(`Successfully updated chat ${chatId} title to: ${newTitle}`);
  }
}