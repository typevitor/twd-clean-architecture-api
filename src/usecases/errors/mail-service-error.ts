export class MailServiceError extends Error {
  constructor () {
    super('Mail Service Error.')
    this.name = 'MailServiceError'
  }
}
