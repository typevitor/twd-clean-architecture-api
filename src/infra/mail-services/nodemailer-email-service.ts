import { Either, left, right } from '@/shared/either'
import { MailServiceError } from '@/usecases/errors/mail-service-error'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports/email-service'
import * as nodemailer from 'nodemailer'

export class NodeMailerEmailService implements EmailService {
  async send (emailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    try {
      const transporter = nodemailer.createTransport({
        host: emailOptions.host,
        port: emailOptions.port,
        auth: {
          user: emailOptions.username,
          pass: emailOptions.password
        }
      })
      await transporter.sendMail({
        from: emailOptions.from,
        to: emailOptions.to,
        subject: emailOptions.subject,
        html: emailOptions.html,
        attachments: emailOptions.attachments
      })
    } catch (error) {
      return left(new MailServiceError())
    }
    return right(emailOptions)
  }
}
