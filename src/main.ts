import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfig } from '@config/app.config';
import { GlobalExceptionFilter } from '@shared/filters/global-exception.filter';
import { ValidationPipe } from '@shared/pipes/validation.pipe';
import { AppModule } from '@src/app.module';

const logger = new Logger('Bootstrap');

const bootstrap = async function bootstrap(): Promise<void> {
  const adapter = new FastifyAdapter({
    trustProxy: true,
    bodyLimit: 10048576,
  });

  adapter.enableCors({
    origin: ['*'], // or '*' or whatever is required
    // allowedHeaders: [
    //   'Access-Control-Allow-Origin',
    //   'Origin',
    //   'X-Requested-With',
    //   'Accept',
    //   'Content-Type',
    //   'Authorization',
    // ],
    // exposedHeaders: 'Authorization',
    // credentials: true,
    methods: ['GET', 'OPTIONS', 'POST'],
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );
  const appConfig = app.get(AppConfig);
  try {
    app.enableShutdownHooks();
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalPipes(new ValidationPipe());

    if (!appConfig.isProduction) {
      const config = new DocumentBuilder()
        .setTitle('GQL Gateway')
        .setDescription('The GQL Gateway API')
        .setVersion('1.0')
        .addTag('doc.json')
        .addBearerAuth(
          {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT Authorization',
            description: 'Enter JWT access token for authorized requests.',
            in: 'header',
          },
          'JWT Token',
        )
        .build();
      const document = SwaggerModule.createDocument(app, config, {
        ignoreGlobalPrefix: false,
      });
      SwaggerModule.setup('/swagger', app, document);
    }
    else {
      app.use((_req, res, next) => {
        res.removeHeader('X-Powered-By');
        res.removeHeader('x-powered-by');
        next();
      });
    }

    await app.listen(appConfig.port, '0.0.0.0', () => {
      logger.debug(`Service available on ${appConfig.baseUrl}`);
      logger.debug(`Swagger available at ${appConfig.baseUrl}/swagger`);
      logger.debug(`GraphQL available at ${appConfig.baseUrl}/graphql`);
      logger.debug(`GraphQL UI available att ${appConfig.baseUrl}/altair`);
    });
  }
  catch (e) {
    logger.error(e);
    logger.error(e?.errors);
    process.exit(1);
  }
};

bootstrap();
