import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  

  //swagger
  const config = new DocumentBuilder()
  .setTitle('ConnectApp API')
  .setDescription('API de la red social ConnectApp')
  .setVersion('1.0')
  .addBearerAuth()
  .build()

  const document = SwaggerModule.createDocument (app, config);
  SwaggerModule.setup('api', app, document); 

  app.enableCors({
    origin: 'http://localhost:3000',  
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',  
    //credentials: true, 
  });

  await app.listen(process.env.PORT ?? 3001); //quiero eliminar el ??
}
bootstrap();
