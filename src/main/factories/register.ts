import { NodeMailerEmailService } from '@/infra/mail-services/nodemailer-email-service'
import { MongoDbUserRepository } from '@/infra/repositories/mongodb'
import { RegisterAndSendEmailUseCase } from '@/usecases/register-and-send-email'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list/register-user-on-mailing-list'
import { SendEmailUseCase } from '@/usecases/send-email'
import { RegisterUserAndSendEmailController } from '@/web-controllers'
import { getEmailOptions } from '@/main/config/email'

export const makeRegisterUserAndSendEmailController = (): RegisterUserAndSendEmailController => {
  const mongoDbUserRepository = new MongoDbUserRepository()
  const registerUserOnMailingList = new RegisterUserOnMailingList(mongoDbUserRepository)
  const nodeMailerService = new NodeMailerEmailService()
  const sendEmailUseCase = new SendEmailUseCase(getEmailOptions(), nodeMailerService)
  const registerAndSendEmailUseCase = new RegisterAndSendEmailUseCase(
    registerUserOnMailingList,
    sendEmailUseCase
  )
  const registerUserAndSendEmailController: RegisterUserAndSendEmailController =
    new RegisterUserAndSendEmailController(registerAndSendEmailUseCase)
  return registerUserAndSendEmailController
}
