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
      throw new HttpException(errorText, res.status);
    }

    const data = await res.json();
    return data?.choices?.[0]?.message?.content ?? 'No response from model';
  }

  async askStream(question: string): Promise<AsyncGenerator<any>> {
    const payload = {
      model: this.model,
      messages: [{ role: 'user', content: question }],
      stream: true,
      temperature: 0.7,
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

    if (!res.ok || !res.body) {
      const text = await res.text();

      console.error('Streaming failed', res.status, text);

      throw new HttpException('Failed to connect to LLM API', res.status);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    async function* streamGenerator() {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });

        for (const line of text.split('\n')) {
          if (line.startsWith('data: ')) {
            const data = line.replace('data: ', '').trim();
            if (data === '[DONE]') return;

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                yield {
                  event: 'message',
                  data: { role: 'assistant', content: delta },
                };
              }
            } catch {
              // skip malformed lines
            }
          }
        }
      }
    }

    return streamGenerator();
  }
}
