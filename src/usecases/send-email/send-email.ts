import { User, UserData } from '@/entities'
import { Either, left } from '@/shared/either'
import { UseCase } from '@/usecases/ports/use-case'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports/email-service'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { SendMailError } from '@/usecases/errors/send-mail-error'

export class SendEmailUseCase implements UseCase {
  private readonly mailOptions: EmailOptions;
  private readonly mailService: EmailService;

  constructor (mailOptions: EmailOptions, mailService: EmailService) {
    this.mailOptions = mailOptions
    this.mailService = mailService
  }

  async perform (userData: UserData): Promise<Either<SendMailError, EmailOptions>> {
    const userOrError: Either<InvalidNameError | InvalidEmailError, User> = User.create(userData)
    if (userOrError.isLeft()) {
      return left(userOrError.value)
    }
    const user = userOrError.value
    const greetings = `E aí, <b>${user.name}</b>, beleza?`
    const customizedHtml = greetings + '<br/><br/>' + this.mailOptions.html
    const emailInfo: EmailOptions = {
      ...this.mailOptions,
      html: customizedHtml,
      to: `${userData.name} <${user.email}>`
    }
    return await this.mailService.send(emailInfo)
  }
}
