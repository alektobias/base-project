import { InjectQueue } from '@nestjs/bull';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Queue } from 'bull';
import { MailQueueItem } from './DTOs/MailQueueItem';

@Injectable()
export class MailProducer {
  constructor(@InjectQueue('mail') private mailQueue: Queue) {}

  async sendMail(data: MailQueueItem) {
    return this.mailQueue
      .add({ ...data })
      .then((res) => res.data)
      .catch((err) => {
        throw new InternalServerErrorException(err);
      });
  }
}
