import { UserData } from '@/entities'
import { Either } from '@/shared/either'
import { UseCase } from '@/usecases/ports/use-case'
import { MailServiceError } from '@/usecases/errors/mail-service-error'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports/email-service'

export class SendEmailUseCase implements UseCase {
  private readonly mailOptions: EmailOptions;
  private readonly mailService: EmailService;

  constructor (mailOptions: EmailOptions, mailService: EmailService) {
    this.mailOptions = mailOptions
    this.mailService = mailService
  }

  async perform (userData: UserData): Promise<Either<MailServiceError, EmailOptions>> {
    const greetings = `E aí, <b>${userData.name}</b>, beleza?`
    const customizedHtml = greetings + '<br/><br/>' + this.mailOptions.html
    const emailInfo: EmailOptions = {
      ...this.mailOptions,
      html: customizedHtml,
      to: `${userData.name} <${userData.email}>`
    }
    return await this.mailService.send(emailInfo)
  }
}
