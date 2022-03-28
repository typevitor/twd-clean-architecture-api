import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { MailServiceError } from '@/usecases/errors/mail-service-error'

export type SendMailError = MailServiceError | InvalidNameError | InvalidEmailError
