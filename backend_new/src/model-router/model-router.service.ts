import { Injectable, BadRequestException } from '@nestjs/common';
import { GeminiService } from '../gemini/gemini.service';
import { GptService } from '../gpt/gpt.service';
import { GrokService } from '../grok/grok.service';

@Injectable()
export class ModelRouterService {
  constructor(
    private geminiService: GeminiService,
    private gptService: GptService,
    private grokService: GrokService,
  ) {}

  async sendMessage(model: string, message: string): Promise<string> {
    switch (model.toLowerCase()) {
      case 'gemini':
        return this.geminiService.sendMessage(message);
      
      case 'gpt':
        return this.gptService.sendMessage(message);

      case 'grok':
        return this.grokService.sendMessage(message);

      default:
        throw new BadRequestException('Unsupported model ' + model);
    }
  }
}
