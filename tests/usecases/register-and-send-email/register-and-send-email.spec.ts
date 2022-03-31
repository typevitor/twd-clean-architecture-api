import { UserData } from '@/entities/user-data'
import { Either, right } from '@/shared/either'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports/user-repository'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list/register-user-on-mailing-list'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository/in-memory-user-repository'
import { SendMailError } from '@/usecases/errors/send-mail-error'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports/email-service'
import { SendEmailUseCase } from '@/usecases/send-email'
import { RegisterAndSendEmailUseCase } from '@/usecases/register-and-send-email'
import { User } from '@/entities'

describe('Register and send email Use Case', () => {
  const attachmentFilepath = '../resources/text.txt'
  const fromName = 'fromName'
  const fromEmail = 'from-email@email.com'
  const toName = 'toName'
  const toEmail = 'to@email.com'
  const subject = 'Email test'
  const emailBody = 'Hello World!'
  const emailBodyHtml = '<b>Hello World!</b>'
  const attachments = [{
    filename: attachmentFilepath,
    contentType: 'text/plain'
  }]

  const mailOptions: EmailOptions = {
    host: 'test',
    port: 0,
    username: 'test',
    password: 'test',
    from: `${fromName} ${fromEmail}`,
    to: `${toName} <${toEmail}>`,
    subject: subject,
    text: emailBody,
    html: emailBodyHtml,
    attachments: attachments
  }

  class MailServiceMock implements EmailService {
    public numberOfCalls = 0;
    async send (emailOptions: EmailOptions): Promise<Either<SendMailError, EmailOptions>> {
      this.numberOfCalls++
      return right(emailOptions)
    }
  }
  test('should add user to mailing list and send email', async () => {
    const users: UserData[] = []
    const userRepo: UserRepository = new InMemoryUserRepository(users)
    const registerUserUseCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(userRepo)
    const mailServiceMock = new MailServiceMock()
    const sendEmailUseCase = new SendEmailUseCase(mailOptions, mailServiceMock)
    const registerAndSendEmailUseCase: RegisterAndSendEmailUseCase = new RegisterAndSendEmailUseCase(
      registerUserUseCase,
      sendEmailUseCase
    )
    const name = 'any_name'
    const email = 'any_email@email.com'
    const response = (await registerAndSendEmailUseCase.perform({ name, email })).value as User
    const user = userRepo.findUserByEmail('any_email@email.com')
    expect((await user).name).toBe('any_name')
    expect(response.name.value).toBe('any_name')
    expect(mailServiceMock.numberOfCalls).toBe(1)
  })
})
