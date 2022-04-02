import { Either, left, right } from '@/shared/either'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports/email-service'
import { MailServiceError } from '@/usecases/errors/mail-service-error'
import { SendEmailUseCase } from '@/usecases/send-email'
import { SendMailError } from '../errors/send-mail-error'
import { User } from '@/entities'

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

class MailServiceStub implements EmailService {
  async send (emailOptions: EmailOptions): Promise<Either<SendMailError, EmailOptions>> {
    return right(emailOptions)
  }
}
class MailServiceWithErrorStub implements EmailService {
  async send (emailOptions: EmailOptions): Promise<Either<SendMailError, EmailOptions>> {
    return left(new MailServiceError())
  }
}

describe('Send Email to User', () => {
  test('should send email to user with valid name and email address', async () => {
    const mailServiceStub = new MailServiceStub()
    const useCase = new SendEmailUseCase(mailOptions, mailServiceStub)
    const user = User.create({
      name: toName,
      email: toEmail
    }).value as User
    const response = (await useCase.perform(user)).value as EmailOptions
    expect(response.to).toBe(`${toName} <${toEmail}>`)
  })

  test('should return error when email service fails', async () => {
    const mailServiceWithErrorStub = new MailServiceWithErrorStub()
    const useCase = new SendEmailUseCase(mailOptions, mailServiceWithErrorStub)
    const user = User.create({
      name: toName,
      email: toEmail
    }).value as User
    const response = await useCase.perform(user)
    expect(response.value).toBeInstanceOf(MailServiceError)
  })
})
