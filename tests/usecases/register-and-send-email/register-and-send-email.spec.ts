import { UserData } from '@/entities/user-data'
import { Either, right } from '@/shared/either'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports/user-repository'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list/register-user-on-mailing-list'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository/in-memory-user-repository'
import { SendMailError } from '@/usecases/errors/send-mail-error'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports/email-service'
import { SendEmailUseCase } from '@/usecases/send-email'
import { RegisterAndSendEmailUseCase } from '@/usecases/register-and-send-email'

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
  test('should register user and send email with valid data', async () => {
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
    const response: UserData = (await registerAndSendEmailUseCase.perform({ name, email })).value as UserData
    const user = userRepo.findUserByEmail('any_email@email.com')
    expect((await user).name).toBe('any_name')
    expect(response.name).toBe('any_name')
    expect(mailServiceMock.numberOfCalls).toBe(1)
  })

  test('should not register user and send email with an invalid email', async () => {
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
    const invalidEmail = 'invalid_email.@email.com'
    const response = (await registerAndSendEmailUseCase.perform({ name, email: invalidEmail })).value as Error
    expect(response.name).toEqual('InvalidEmailError')
  })

  test('should not register user and send email with and invalid name', async () => {
    const users: UserData[] = []
    const userRepo: UserRepository = new InMemoryUserRepository(users)
    const registerUserUseCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(userRepo)
    const mailServiceMock = new MailServiceMock()
    const sendEmailUseCase = new SendEmailUseCase(mailOptions, mailServiceMock)
    const registerAndSendEmailUseCase: RegisterAndSendEmailUseCase = new RegisterAndSendEmailUseCase(
      registerUserUseCase,
      sendEmailUseCase
    )
    const invalidName = 'a'
    const email = 'valid_mail@email.com'
    const response = (await registerAndSendEmailUseCase.perform({ name: invalidName, email })).value as Error
    expect(response.name).toEqual('InvalidNameError')
  })
})
