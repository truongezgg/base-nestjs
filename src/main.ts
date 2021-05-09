require('dotenv').config();
import 'module-alias/register';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as helmet from 'helmet';

/**
 * https://docs.nestjs.com/first-steps
 *
 * To create a Nest application instance,  we use the core NestFactory class.
 * NestFactory exposes a few static methods that allow creating an application instance.
 *
 * The create() method returns an application object, which fulfills the INestApplication interface.
 * In the main.ts example below, we simply start up our HTTP listener,
 * which lets the application await inbound HTTP requests.
 *
 * Express is a well-known minimalist web framework for node.
 * It's a battle tested, production-ready library with lots of resources implemented by the community.
 * The @nestjs/platform-express package is used by default.
 * Many users are well served with Express, and need take no action to enable it.
 *
 * Running the application: "npm run start".
 * This command starts the app with the HTTP server listening on the port defined in the src/main.ts file.
 * Once the application is running, open your browser and navigate to http://localhost:3000/.
 * You should see the Hello World! message.
 */
(async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.use(helmet());

  await app.listen(3000);
  console.log('Server is running on port 3000');
})();
