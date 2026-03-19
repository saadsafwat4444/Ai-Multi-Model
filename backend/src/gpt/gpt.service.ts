// src/cohere/cohere.service.ts
import { Injectable, Logger } from '@nestjs/common';
import fetch from 'node-fetch';

interface CohereChatResponse {
  response: string;
  text?: string;
  message?: string;
}

@Injectable()
export class GptService {
  private readonly apiKey = process.env.COHERE_API_KEY;
  private readonly logger = new Logger(GptService.name);

  constructor() {
    if (!this.apiKey) {
      this.logger.error('COHERE_API_KEY not set in environment variables!');
    }
  }

  /**
   * توليد نصوص باستخدام Cohere Chat API الجديد
   * @param prompt الجملة أو الفكرة اللي عايز تولد منها نص
   * @param max_tokens الحد الأقصى لعدد الكلمات/التوكنات
   */
  async generateText(prompt: string, max_tokens = 100): Promise<string> {
    if (!this.apiKey) throw new Error("COHERE_API_KEY not set");

    // Validate input
    if (!prompt || prompt.trim().length === 0) {
      this.logger.error('Empty prompt provided to generateText');
      throw new Error("Prompt cannot be empty");
    }

    this.logger.log(`Sending prompt to Cohere: "${prompt.slice(0, 50)}..."`);

    try {
      const requestBody = {
        model: "command-xlarge-nightly",
        message: prompt.trim(),
        max_tokens,
      };
      
      this.logger.log(`Request body: ${JSON.stringify(requestBody)}`);
      
      const response = await fetch("https://api.cohere.ai/v1/chat", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errText = await response.text();
        this.logger.error(`Cohere API error: ${errText}`);
        throw new Error(`Cohere API returned status ${response.status}`);
      }

      const data = await response.json() as CohereChatResponse;
      const text = data.response || data.text || data.message || '';

      this.logger.log(`Generated text: ${text?.slice(0, 50)}...`);
      return text;
    } catch (error) {
      this.logger.error(`Failed to generate text: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Send message using Cohere Chat API (alias for generateText)
   * @param message The message to send
   * @returns Generated response
   */
  async sendMessage(message: string): Promise<string> {
    if (!message || message.trim().length === 0) {
      this.logger.error('Empty message provided to sendMessage');
      throw new Error("Message cannot be empty");
    }
    return this.generateText(message);
  }

  /**
   * Send message with conversation history to maintain context
   * @param messages Array of conversation messages with role and content
   * @returns Generated response
   */
  async sendMessageWithHistory(messages: Array<{role: string, content: string}>): Promise<string> {
    if (!messages || messages.length === 0) {
      this.logger.error('No messages provided to sendMessageWithHistory');
      throw new Error("Messages cannot be empty");
    }

    // Extract the last user message as the main prompt
    const lastUserMessage = messages.filter(msg => msg.role === 'user').pop();
    if (!lastUserMessage) {
      this.logger.error('No user message found in conversation history');
      throw new Error("No user message found");
    }

    // Build conversation context for Cohere
    const conversationHistory = messages.map(msg => ({
      role: msg.role === 'user' ? 'USER' : 'CHATBOT',
      message: msg.content
    }));

    this.logger.log(`Sending conversation with ${messages.length} messages to Cohere`);

    try {
      const requestBody = {
        model: "command-xlarge-nightly",
        message: lastUserMessage.content,
        chat_history: conversationHistory.slice(0, -1), // All messages except the last one
        max_tokens: 1000,
      };
      
      this.logger.log(`Request body: ${JSON.stringify(requestBody)}`);
      
      const response = await fetch("https://api.cohere.ai/v1/chat", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errText = await response.text();
        this.logger.error(`Cohere API error: ${errText}`);
        throw new Error(`Cohere API returned status ${response.status}`);
      }

      const data = await response.json() as CohereChatResponse;
      const text = data.response || data.text || data.message || '';

      this.logger.log(`Generated response: ${text?.slice(0, 50)}...`);
      return text;
    } catch (error) {
      this.logger.error(`Failed to generate response with history: ${(error as Error).message}`);
      
      // Check for quota/rate limit errors
      if (error.message && (error.message.includes('quota') || error.message.includes('429') || error.message.includes('rate limit'))) {
        return "⏰ وصلت للحد الأقصى من الطلبات. حاول مرة أخرى بعد قليل أو استخدم موديل آخر.";
      }
      
      throw error;
    }
  }
}