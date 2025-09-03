import {
  Controller,
  Post,
  Body,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { ChatRequestDto } from './dto/chat-request.dto';
import { Response } from 'express';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('ask')
  @ApiOperation({ summary: 'Ask the model a question' })
  @ApiResponse({ status: 201, description: 'Model response returned' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async ask(@Body() dto: ChatRequestDto) {
    if (!dto?.question) throw new BadRequestException('Question is required');

    const answer = await this.chatService.ask(dto.question);
    return {
      messages: [
        { role: 'user', content: dto.question },
        { role: 'assistant', content: answer },
      ],
    };
  }

  @Post('ask/stream')
  @ApiOperation({ summary: 'Ask the model a question (streaming)' })
  @ApiResponse({ status: 200, description: 'Streaming chunks returned' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async askStream(@Body() dto: ChatRequestDto, @Res() res: Response) {
    if (!dto?.question) throw new BadRequestException('Question is required');

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      const stream = await this.chatService.askStream(dto.question);

      for await (const chunk of stream) {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      }

      res.write(`data: [DONE]\n\n`);
      res.end();
    } catch (err) {
      res.write(
        `data: ${JSON.stringify({ event: 'error', data: { message: err.message } })}\n\n`,
      );
      res.write(`data: [DONE]\n\n`);
      res.end();
    }
  }
}
