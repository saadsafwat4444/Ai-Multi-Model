// import { Injectable, BadRequestException } from '@nestjs/common';
// import { GeminiService } from '../gemini/gemini.service';
// import { GptService } from '../gpt/gpt.service';
// import { GrokService } from '@/grok/grok.service';
 

// @Injectable()
// export class ModelRouterService {
//   constructor(
//     private geminiService: GeminiService,
//     private gptService: GptService,
//     private grokService: GrokService,
//   ) {}

//   async sendMessage(model: string, message: string): Promise<string> {
//     switch (model.toLowerCase()) {
//       case 'gemini':
//         return this.geminiService.sendMessage(message);
      
//       case 'gpt':
//         return this.gptService.sendMessage(message);

//       case 'grok':
//         return this.grokService.sendMessage(message);

//       default:
//         throw new BadRequestException('Unsupported model ' + model);
//     }
//   }
// }


import { BadRequestException, Injectable } from "@nestjs/common";
import { GeminiService } from "src/gemini/gemini.service";
import { GptService } from "src/gpt/gpt.service";
import { ChatService } from "src/chat/chat.service";
import { GrokService } from "src/grok/grok.service";

@Injectable()
export class ModelRouterService {
  constructor(
    private geminiService: GeminiService,
    private gptService: GptService,
    private grokService: GrokService,
    private chatService: ChatService,
  ) {}

  async sendMessage(model: string, chat: any, message: string) {
    // جلب كل رسائل المحادثة السابقة
    const conversationHistory = await this.chatService.getChatMessages(chat.id);
    
    // تحويل الرسائل لصيغة الـ API
    const messages = conversationHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    switch (model) {
      case 'gemini':
        const geminiResponse = await this.geminiService.sendMessageWithHistory(messages);
        // Ensure consistent return format
        return { success: true, message: geminiResponse };
      case 'gpt':
        const gptResponse = await this.gptService.sendMessageWithHistory(messages);
        // Ensure consistent return format
        return { success: true, message: gptResponse };
      case 'grok':
        const grokResponse = await this.grokService.sendMessageWithHistory(messages);
        // Ensure consistent return format
        return { success: true, message: grokResponse };
      default:
        throw new BadRequestException('Unsupported model ' + model);
    }
  }

  async getUserChats(userId: number, model?: string) {
    return this.chatService.getUserChats(userId, model);
  }

  async getChatMessages(chatId: string) {
    return this.chatService.getChatMessages(chatId);
  }
}