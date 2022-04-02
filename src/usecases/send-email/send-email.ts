import { User } from '@/entities'
import { Either } from '@/shared/either'
import { UseCase } from '@/usecases/ports/use-case'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports/email-service'
import { MailServiceError } from '@/usecases/errors/mail-service-error'

export class SendEmailUseCase implements UseCase {
  private readonly mailOptions: EmailOptions;
  private readonly mailService: EmailService;

  constructor (mailOptions: EmailOptions, mailService: EmailService) {
    this.mailOptions = mailOptions
    this.mailService = mailService
  }

  async perform (user: User): Promise<Either<MailServiceError, EmailOptions>> {
    const greetings = `E aí, <b>${user.name.value}</b>, beleza?`
    const customizedHtml = greetings + '<br/><br/>' + this.mailOptions.html
    const emailInfo: EmailOptions = {
      ...this.mailOptions,
      html: customizedHtml,
      to: `${user.name.value} <${user.email.value}>`
    }
    return await this.mailService.send(emailInfo)
  }
}
