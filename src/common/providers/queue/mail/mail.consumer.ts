import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailQueueItem } from './DTOs/MailQueueItem';

@Processor('mail')
export class MailConsumer {
  constructor(private mailerServicer: MailerService) {}
  @Process()
  async sendMail({ data }: Job<MailQueueItem>) {
    try {
      const teste = await this.mailerServicer.sendMail(data);
      console.log(teste);
      return;
    } catch (err) {
      console.log(err);
    }
  }
}
