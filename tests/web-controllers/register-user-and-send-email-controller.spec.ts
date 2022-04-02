import { UserData } from '@/entities'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports/user-repository'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list/register-user-on-mailing-list'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository/in-memory-user-repository'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports'
import { RegisterUserAndSendEmailController } from '@/web-controllers/register-user-and-send-email-controller'
import { MissingParamError } from '@/web-controllers/errors'
import { UseCase } from '@/usecases/ports/use-case'
import { SendEmailUseCase } from '@/usecases/send-email'
import { RegisterAndSendEmailUseCase } from '@/usecases/register-and-send-email'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports/email-service'
import { Either, right } from '@/shared/either'
import { MailServiceError } from '@/usecases/errors/mail-service-error'

class UsecaseWithError implements UseCase {
  perform (request: any): Promise<void> {
    throw Error()
  }
}

class MailServiceStub implements EmailService {
  async send (emailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    return right(emailOptions)
  }
}

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

describe('Register user and send email controller', () => {
  const users: UserData[] = []
  const mailService = new MailServiceStub()
  const sendEmailUseCase: SendEmailUseCase = new SendEmailUseCase(mailOptions, mailService)
  const repo: UserRepository = new InMemoryUserRepository(users)
  const registerUserUseCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
  const registerAndSendEmailUseCase: RegisterAndSendEmailUseCase = new RegisterAndSendEmailUseCase(
    registerUserUseCase,
    sendEmailUseCase
  )
  const controller: RegisterUserAndSendEmailController = new RegisterUserAndSendEmailController(registerAndSendEmailUseCase)

  test('should return status code 201 when request contains valid user data', async () => {
    const request: HttpRequest = {
      body: {
        name: 'Any name',
        email: 'any@mail.com'
      }
    }
    const response: HttpResponse = await controller.handle(request)
    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual(request.body)
  })

  test('should return status code 400 when request contains invalid user name', async () => {
    const requestWithInvalidName: HttpRequest = {
      body: {
        name: 'a',
        email: 'any@mail.com'
      }
    }
    const response: HttpResponse = await controller.handle(requestWithInvalidName)
    expect(response.statusCode).toBe(400)
    expect(response.body).toBeInstanceOf(InvalidNameError)
  })

  test('should return status code 400 when request contains invalid email', async () => {
    const requestWithInvalidEmail: HttpRequest = {
      body: {
        name: 'Any name',
        email: 'invalidmail.@mail.com'
      }
    }
    const response: HttpResponse = await controller.handle(requestWithInvalidEmail)
    expect(response.statusCode).toBe(400)
    expect(response.body).toBeInstanceOf(InvalidEmailError)
  })

  test('should return status code 400 when request is missing user name', async () => {
    const requestWithMissingName: HttpRequest = {
      body: {
        email: 'invalidmail.@mail.com'
      }
    }
    const response: HttpResponse = await controller.handle(requestWithMissingName)
    expect(response.statusCode).toBe(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter from request: name.')
  })

  test('should return status code 400 when request is missing email', async () => {
    const requestWithMissingEmail: HttpRequest = {
      body: {
        name: 'Any name'
      }
    }
    const response: HttpResponse = await controller.handle(requestWithMissingEmail)
    expect(response.statusCode).toBe(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter from request: email.')
  })

  test('should return status code 400 when request is missing name and email', async () => {
    const requestWithMissingUserData: HttpRequest = {
      body: {}
    }
    const response: HttpResponse = await controller.handle(requestWithMissingUserData)
    expect(response.statusCode).toBe(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter from request: name email.')
  })

  test('should return status code 500 when server raises', async () => {
    const request: HttpRequest = {
      body: {
        name: 'Any name',
        email: 'any@mail.com'
      }
    }
    const usecaseWithError: UseCase = new UsecaseWithError()
    const controller: RegisterUserAndSendEmailController = new RegisterUserAndSendEmailController(usecaseWithError)
    const response: HttpResponse = await controller.handle(request)
    expect(response.statusCode).toBe(500)
    expect(response.body).toBeInstanceOf(Error)
  })
})
