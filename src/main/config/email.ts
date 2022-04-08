import { EmailOptions } from '@/usecases/send-email/ports/email-service'

const attachments = []

export const getEmailOptions = (): EmailOptions => {
  const from = 'Vitor Leal <vitorlealeng@gmail.com>'
  const to = ''
  const mailOptions: EmailOptions = {
    host: process.env.EMAIL_HOST,
    port: Number.parseInt(process.env.EMAIL_PORT),
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    from: from,
    to: to,
    subject: 'Título de teste',
    text: 'Mensagem de teste',
    html: '<b>HTML de teste</b>',
    attachments: attachments
  }
  return mailOptions
}
