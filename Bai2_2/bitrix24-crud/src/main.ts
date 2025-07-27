import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { engine } from 'express-handlebars';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config({ path: '.env' });
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: false,
  }));
  app.setViewEngine('hbs');

  await app.listen(process.env.PORT || 2000);
}
bootstrap();