 

// =========================================

import { Controller, Post, Get, Delete, Put, Body, Req, UseGuards, Param, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Message } from '../entities/messages/messages.entity';
import { Chat } from '../entities/chats/chats.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ModelRouterService } from 'src/model-router/model-router.service';

@Controller('chat')
export class ChatController {
  constructor(
    private chatService: ChatService,
    private modelRouterService: ModelRouterService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async sendMessage(@Req() req, @Body() body): Promise<{ userMessage: Message; aiMessage: Message }> {
    console.log("Logged user:", req.user);
    const userId = req.user?.userId || 1;
    const model = body.selectedModel || 'gemini';

    // إنشاء أو إيجاد الشات
    const chat: Chat = await this.chatService.findOrCreateChat(
      userId,
      body.chatId,
      model,
      body.message
    );

    // حفظ رسالة المستخدم
    const userMessage: Message = await this.chatService.addMessage(
      chat.id,
      'user',
      body.message,
      model,
    );

    console.log("=== /chat request received ===");
    console.log("Request body:", body);
    console.log("model:", model, "message:", body.message, "chatId:", body.chatId);
    console.log("Cookies:", req.cookies);
    console.log("Authorization header:", req.headers.authorization);

    let aiReplyText;

    try {
      // إرسال الرسالة للموديل المناسب
      const aiResponse = await this.modelRouterService.sendMessage(
        model,
        chat,
        body.message
      );

      // Extract the message from the response
      aiReplyText = aiResponse.message || aiResponse;
    } catch (err) {
      console.error(err);
      
      // Check for specific error types
      if (err.message && err.message.includes('quota')) {
        aiReplyText = "⏰ وصلت للحد الأقصى من الطلبات اليومية. حاول مرة أخرى بعد قليل أو استخدم موديل آخر.";
      } else if (err.message && err.message.includes('429')) {
        aiReplyText = "⏰ عدد الطلبات كثير جدًا الآن. انتظر بضع دقائق ثم حاول مرة أخرى.";
      } else if (err.message && err.message.includes('API key')) {
        aiReplyText = "🔑 مشكلة في مفتاح الـ API. يرجى التحقق من الإعدادات.";
      } else if (err.message && err.message.includes('network') || err.message.includes('fetch')) {
        aiReplyText = "🌐 مشكلة في الاتصال بالإنترنت. تحقق من اتصالك وحاول مرة أخرى.";
      } else {
        aiReplyText = "❌ حدث خطأ غير متوقع. حاول مرة أخرى أو استخدم موديل آخر.";
      }
    }

    // حفظ رد الـ AI
    const aiMessage: Message = await this.chatService.addMessage(
      chat.id,
      'assistant',
      aiReplyText,
      model,
    );

    return { userMessage, aiMessage };
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  async getHistory(@Req() req, @Query('model') model: string) {
    const userId = req.user.userId;
    const chats = await this.chatService.getUserChats(userId, model);
    return chats.map(chat => ({ id: chat.id, title: chat.title }));
  }

  @Get(':chatId/messages')
  @UseGuards(JwtAuthGuard)
  async getMessages(@Param('chatId') chatId: string): Promise<Message[]> {
    const messages = await this.chatService.getChatMessages(chatId);
    return messages;
  }

  @Delete(':chatId')
  @UseGuards(JwtAuthGuard)
  async deleteChat(@Param('chatId') chatId: string, @Req() req): Promise<{ message: string }> {
    const userId = req.user.userId;
    await this.chatService.deleteChat(chatId, userId);
    return { message: 'Chat deleted successfully' };
  }

  @Put(':chatId/title')
  @UseGuards(JwtAuthGuard)
  async updateChatTitle(@Param('chatId') chatId: string, @Body() body: { title: string }, @Req() req): Promise<{ message: string }> {
    const userId = req.user.userId;
    await this.chatService.updateChatTitle(chatId, userId, body.title);
    return { message: 'Chat title updated successfully' };
  }
}