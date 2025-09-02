import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChatRequestDto {
  @ApiProperty({
    description: 'The user question to send to the LLM',
    example: 'What is the meaning of life?',
  })
  @IsString()
  @IsNotEmpty()
  question: string;
}
