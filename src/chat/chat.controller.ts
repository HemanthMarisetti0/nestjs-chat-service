import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { ChatRequestDto } from './dto/chat-request.dto';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({ summary: 'Ask the model a question' })
  @ApiResponse({ status: 201, description: 'Model response returned' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async ask(@Body() dto: ChatRequestDto) {
    if (!dto?.question) throw new BadRequestException('Question is required');
    const answer = await this.chatService.ask(dto.question);
    return { question: dto.question, answer };
  }
}
