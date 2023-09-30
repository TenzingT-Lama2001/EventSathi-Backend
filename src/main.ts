import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';
import { NODE_ENV, PORT } from './config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ptLogger } from 'src/logger';
import { ValidationPipe } from './pipes/validation.pipe';

const logger = ptLogger.child({ file: __filename });
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  console.log('🚀 ~ file: main.ts:22 ~ bootstrap ~ NODE_ENV:', NODE_ENV);
  if (NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Event Sathi')
      .setDescription('Event Sathi API specification')
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //   }),
  // );

  app.use(helmet());
  await app.listen(PORT, () => {
    logger.info(`Server started on port ${PORT}`);
  });
}
bootstrap();
