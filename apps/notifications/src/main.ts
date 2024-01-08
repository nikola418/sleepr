import { NOTIFICATIONS_PACKAGE_NAME } from '@app/common/types/notifications';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { join } from 'path';
import { NotificationsModule } from './notifications.module';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      protoPath: join(__dirname, '../../../proto/notifications.proto'),
      package: NOTIFICATIONS_PACKAGE_NAME,
      url: configService.getOrThrow('NOTIFICATIONS_GRPC_URL'),
    },
  });

  app.useLogger(app.get(Logger));
  await app.startAllMicroservices();
}
bootstrap();
