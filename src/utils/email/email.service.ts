import { Inject, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as sendgrid from '@sendgrid/mail';
import { ConfigService } from '../../config/config.service';

export enum EmailProvider {
  SMTP = 'smtp',
  SENDGRID = 'sendgrid',
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const provider = this.configService.get('EMAIL_PROVIDER');
    console.log('provider:', provider);

    if (provider === EmailProvider.SENDGRID) {
      sendgrid.setApiKey(this.configService.get('SENDGRID_API_KEY'));
    } else {
      this.transporter = nodemailer.createTransport({
        host: this.configService.get('SMTP_HOST'),
        port: this.configService.get('SMTP_PORT'),
        auth: {
          user: this.configService.get('SMTP_USER'),
          pass: this.configService.get('SMTP_PASS'),
        },
      });
    }
  }

  async sendEmail(
    to: string,
    subject: string,
    text: string,
    attachments?: any[],
  ) {
    const provider = this.configService.get('EMAIL_PROVIDER');

    if (provider === EmailProvider.SENDGRID) {
      return await sendgrid.send({
        to,
        from: this.configService.get('FROM_EMAIL'),
        subject,
        text,
        attachments,
      });
    } else {
      return await this.transporter.sendMail({
        to,
        from: this.configService.get('FROM_EMAIL'),
        subject,
        text,
        attachments,
      });
    }
  }
}
