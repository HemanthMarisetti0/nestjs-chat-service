import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
     origin: '*', 
     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });


  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;

  const config = new DocumentBuilder()
    .setTitle('Chat API')
    .setDescription(
      'I can assist you with a variety of tasks, including:\n\n' +
        '1. **Answering Questions**: General information and knowledge.\n' +
        '2. **Writing Assistance**: Emails, content, editing, summarization.\n' +
        '3. **Learning Support**: Explaining math, science, history, etc.\n' +
        '4. **Language Translation**: Between many languages.\n' +
        '5. **Programming Help**: Coding, debugging, explanations.\n' +
        '6. **General Advice**: Technology, travel, personal growth.\n' +
        '7. **Creative Assistance**: Brainstorming stories, projects, ideas.\n' +
        '8. **Research Assistance**: Gathering and summarizing info.',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(`📖 Swagger UI: http://localhost:${port}/api`);
}
bootstrap();
