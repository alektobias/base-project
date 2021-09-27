import { ISendMailOptions } from '@nestjs-modules/mailer';

export type MailQueueItem = Required<
  Pick<
    ISendMailOptions,
    'to' | 'from' | 'subject' | 'text' | 'template' | 'context'
  >
>;
