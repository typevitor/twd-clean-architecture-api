import { Email } from '@/entities/email-validation'

describe('Email Validation', () => {
  test('Should not accept null strings', () => {
    const email = null
    expect(Email.validate(email)).toBeFalsy()
  })

  test('Should not accept empty strings', () => {
    const email: string = ''
    expect(Email.validate(email)).toBeFalsy()
  })

  test('Should return true when valid email is provided', () => {
    const email: string = 'valid_email@mail.com'
    expect(Email.validate(email)).toBeTruthy()
  })
})
