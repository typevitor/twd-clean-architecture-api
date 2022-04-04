import { UserData } from '@/entities'
import { HttpRequest, HttpResponse } from './ports'
import { ok, badRequest, serverError } from '@/web-controllers/utils/http-helper'
import { MissingParamError } from './errors'
import { UseCase } from '@/usecases/ports/use-case'

export class RegisterUserAndSendEmailController {
  private readonly usecase: UseCase

  constructor (usecase: UseCase) {
    this.usecase = usecase
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      if (!request.body.name || !request.body.email) {
        let missingParam: string = !request.body.name ? 'name ' : ''
        missingParam += !request.body.email ? 'email' : ''
        return badRequest(new MissingParamError(missingParam.trim()))
      }

      const userData: UserData = request.body
      const response = await this.usecase.perform(userData)
      if (response.isLeft()) {
        return badRequest(response.value)
      }
      return ok(response.value)
    } catch (error) {
      return serverError(error)
    }
  }
}
