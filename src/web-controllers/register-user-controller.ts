import { UserData } from '@/entities'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list/register-user-on-mailing-list'
import { HttpRequest, HttpResponse } from './ports'
import { created, badrequest } from '@/web-controllers/utils/http-helper'
import { MissingParamError } from './errors'

export class RegisterUserController {
  private readonly usecase: RegisterUserOnMailingList

  constructor (usecase: RegisterUserOnMailingList) {
    this.usecase = usecase
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    if (!request.body.name || !request.body.email) {
      let missingParam: string = !request.body.name ? 'name ' : ''
      missingParam += !request.body.email ? 'email' : ''
      return badrequest(new MissingParamError(missingParam.trim()))
    }

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
