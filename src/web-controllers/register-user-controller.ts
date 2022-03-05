import { UserData } from '@/entities'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list/register-user-on-mailing-list'
import { HttpRequest, HttpResponse } from './ports'
import { created, badrequest } from '@/web-controllers/utils/http-helper'

export class RegisterUserController {
  private readonly usecase: RegisterUserOnMailingList

  constructor (usecase: RegisterUserOnMailingList) {
    this.usecase = usecase
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    const userData: UserData = request.body
    const response = await this.usecase.registerUserOnMailingList(userData)
    if (response.isLeft()) {
      return badrequest(response.value)
    }
    if (response.isRight()) {
      return created(response.value)
    }
  }
}
