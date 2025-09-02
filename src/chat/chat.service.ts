import { Injectable, Logger, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private readonly apiKey: string;
  private readonly model: string;

  constructor(private readonly config: ConfigService) {
    this.apiKey = this.config.get<string>('LLM_API_KEY') ?? '';
    this.model = this.config.get<string>('MODEL') ?? 'openai/gpt-4o';
  }

  async ask(question: string): Promise<string> {
    const payload = {
      model: this.model,
      messages: [{ role: 'user', content: question }],
      max_tokens: 500,
    };

    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };

    const res = await fetch(this.apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      this.logger.error(`API error ${res.status}: ${errorText}`);

      let errorData: any;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }

      throw new HttpException(
        {
          statusCode: res.status,
          error: 'LLM API Error',
          details: errorData,
        },
        res.status,
      );
    }

    const data = await res.json();
    return data?.choices?.[0]?.message?.content ?? 'No response from model';
  }
}
