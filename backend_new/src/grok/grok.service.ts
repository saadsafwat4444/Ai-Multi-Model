import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GrokService {
  private apiUrl = 'https://api.x.ai/v1/chat/completions';
  private apiKey = process.env.GROK_API_KEY;

  async sendMessage(message: string): Promise<string> {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: 'grok-beta',
          messages: [{ role: 'user', content: message }],
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Grok API Error:', error);
      throw new Error('Failed to get response from Grok');
    }
  }
}
