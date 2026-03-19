import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is missing in .env');
    }
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  async sendMessage(message: string): Promise<string> {
    try {
      // استخدم الموديل اللي اشتغل مباشرة
      const modelName = 'models/gemini-2.5-flash';
      console.log(`Using model: ${modelName}`);
      
      const model = this.genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(message);
      const response = await result.response;
      
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to get response from Gemini');
    }
  }

  async sendWithQuotaHandling(chat: any, message: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.sendMessage(message);
      return { success: true, message: response };
    } catch (error) {
      console.error('Gemini API Error:', error);
      return { success: false, message: 'Failed to get response from Gemini' };
    }
  }

  /**
   * Send message with conversation history to maintain context
   * @param messages Array of conversation messages with role and content
   * @returns Generated response
   */
  async sendMessageWithHistory(messages: Array<{role: string, content: string}>): Promise<string> {
    console.log('=== Gemini sendMessageWithHistory Start ===');
    console.log('API Key exists:', !!process.env.GEMINI_API_KEY);
    console.log('Input messages:', JSON.stringify(messages, null, 2));
    
    try {
      // استخدم الموديل اللي اشتغل مباشرة
      const modelName = 'models/gemini-2.5-flash';
      console.log(`Using model: ${modelName} with ${messages.length} messages`);
      
      const model = this.genAI.getGenerativeModel({ model: modelName });
      console.log('Model created successfully');
      
      // If no history, send single message
      if (messages.length <= 1) {
        console.log('No history found, sending single message');
        const result = await model.generateContent(messages[0].content);
        const response = await result.response;
        return response.text();
      }
      
      // Start a chat session with history
      const historyMessages = messages.slice(0, -1).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));
      
      console.log('History messages:', JSON.stringify(historyMessages, null, 2));
      
      const chat = model.startChat({
        history: historyMessages
      });
      console.log('Chat session started successfully');
      
      // Send the last message
      const lastMessage = messages[messages.length - 1];
      console.log('Sending last message:', lastMessage.content);
      
      const result = await chat.sendMessage(lastMessage.content);
      console.log('Message sent successfully');
      const response = await result.response;
      console.log('Response received');
      
      return response.text();
    } catch (error) {
      console.error('=== Gemini API Error ===');
      console.error('Full error:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Error type:', typeof error);
      
      // Fallback to single message if history fails
      try {
        console.log('=== Attempting Fallback ===');
        const model = this.genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });
        const lastMessage = messages[messages.length - 1];
        console.log('Fallback message:', lastMessage.content);
        
        const result = await model.generateContent(lastMessage.content);
        const response = await result.response;
        const text = response.text();
        console.log('Fallback successful:', text.substring(0, 100));
        return text;
      } catch (fallbackError) {
        console.error('=== Fallback Failed ===');
        console.error('Fallback error:', fallbackError);
        console.error('Fallback message:', fallbackError.message);
        throw new Error(`Gemini failed: ${fallbackError.message}`);
      }
    }
  }
}