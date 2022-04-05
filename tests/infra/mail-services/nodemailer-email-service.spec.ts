import { EmailOptions } from '@/usecases/send-email/ports/email-service'
import { NodeMailerEmailService } from '@/infra/mail-services/nodemailer-email-service'
import { MailServiceError } from '@/usecases/errors/mail-service-error'

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

jest.mock('nodemailer')
const nodemailer = require('nodemailer')
const sendMailMock = jest.fn().mockReturnValueOnce('ok')
nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock })

describe('NodeMailer MailService Adapter', () => {
  beforeEach(() => {
    sendMailMock.mockClear()
    nodemailer.createTransport.mockClear()
  })

  test('Should return OK if e-mail is sent', async () => {
    const nodeMailer = new NodeMailerEmailService()
    const result = await nodeMailer.send(mailOptions)
    expect(result.value).toEqual(mailOptions)
  })

  test('Should return ERROR if e-mail is not sent', async () => {
    sendMailMock.mockImplementationOnce(() => {
      throw new Error()
    })
    const nodeMailer = new NodeMailerEmailService()
    const result = await nodeMailer.send(mailOptions)
    expect(result.value).toBeInstanceOf(MailServiceError)
  })
})
