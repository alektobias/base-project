import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailProducer } from './mail/mail.producer';
import { MailConsumer } from './mail/mail.consumer';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379, { infer: true }),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'mail',
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_TRANSPORT_HOST'),
          port: configService.get('MAIL_TRANSPORT_PORT'),
          secure: configService.get('MAIL_TRANSPORT_SECURE'),
          auth: {
            user: configService.get('MAIL_TRANSPORT_USER'),
            pass: configService.get('MAIL_TRANSPORT_PASS'),
          },
        },
        defaults: {
          from: configService.get('MAIL_DEFAULT_FROM'),
        },
        template: {
          dir: process.cwd() + '/src/common/templates/',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: false,
            partials: {
              dir: process.cwd() + '/src/common/templates/partials',
              options: {
                strict: true,
              },
            },
          },
        },
      }),
    }),
  ],
  providers: [MailProducer, MailConsumer],
  exports: [MailProducer],
})
export class QueueModule {}
