import { Controller, Post, Get, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async sendMessage(
    @Body() body: { chatId: string | null; selectedModel: string; message: string },
    @Req() req: Request
  ) {
    const userId = (req as any).user.id;
    return this.chatService.sendMessage(body.chatId, body.selectedModel, body.message, userId);
  }

  @Get('history')
  async getChatHistory(@Req() req: Request) {
    const userId = (req as any).user.id;
    return this.chatService.getChatHistory(userId);
  }

  @Get(':id/messages')
  async getChatMessages(@Param('id') chatId: string, @Req() req: Request) {
    const userId = (req as any).user.id;
    return this.chatService.getChatMessages(chatId, userId);
  }

  @Delete(':id')
  async deleteChat(@Param('id') chatId: string, @Req() req: Request) {
    const userId = (req as any).user.id;
    return this.chatService.deleteChat(chatId, userId);
  }
}
