import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //jwt 

  //swagger
  const config = new DocumentBuilder()
  .setTitle('LinkUpp API')
  .setDescription('API de la red social LinkUpp')
  .setVersion('1.0')
  .build()

  const document = SwaggerModule.createDocument (app, config);
  SwaggerModule.setup('api', app, document); 

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
