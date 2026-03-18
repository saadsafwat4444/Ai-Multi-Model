import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GptService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';
  private apiKey = process.env.GPT_API_KEY;

  async sendMessage(message: string): Promise<string> {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: 'gpt-3.5-turbo',
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
      console.error('GPT API Error:', error);
      throw new Error('Failed to get response from GPT');
    }
  }
}
