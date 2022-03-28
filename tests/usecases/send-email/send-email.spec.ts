import { Either, Left, Right, right } from '@/shared/either'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports/email-service'
import { MailServiceError } from '@/usecases/errors/mail-service-error'
import { SendEmailUseCase } from '@/usecases/send-email'

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
  async send (emailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    return right(emailOptions)
  }
}

describe('Send Email to User', () => {
  test('should send email to user with valid name and email address', async () => {
    const mailServiceStub = new MailServiceStub()
    const useCase = new SendEmailUseCase(mailOptions, mailServiceStub)
    const response = await useCase.perform({
      name: toName,
      email: toEmail
    })
    expect(response).toBeInstanceOf(Right)
  })

  test('should not send email to user with invalid email address', async () => {
    const mailServiceStub = new MailServiceStub()
    const useCase = new SendEmailUseCase(mailOptions, mailServiceStub)
    const response = await useCase.perform({
      name: toName,
      email: 'invalid_email'
    })
    expect(response).toBeInstanceOf(Left)
  })
})
