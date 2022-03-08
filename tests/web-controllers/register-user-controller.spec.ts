import { UserData } from '@/entities'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports/user-repository'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list/register-user-on-mailing-list'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository/in-memory-user-repository'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports'
import { RegisterUserController } from '@/web-controllers/register-user-controller'
import { MissingParamError } from '@/web-controllers/errors'
import { UseCase } from '@/usecases/ports/use-case'

class UsecaseWithError implements UseCase {
  perform (request: any): Promise<void> {
    throw Error()
  }
}

describe('Register user web controller', () => {
  const users: UserData[] = []
  const repo: UserRepository = new InMemoryUserRepository(users)
  const usecase: UseCase = new RegisterUserOnMailingList(repo)
  const controller: RegisterUserController = new RegisterUserController(usecase)

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
    const controller: RegisterUserController = new RegisterUserController(usecaseWithError)
    const response: HttpResponse = await controller.handle(request)
    expect(response.statusCode).toBe(500)
    expect(response.body).toBeInstanceOf(Error)
  })
})
