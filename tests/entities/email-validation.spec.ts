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

  test('Should return false if localpart is larger than 64 chars', () => {
    const email: string = 'a'.repeat(65) + '@mail.com'
    expect(Email.validate(email)).toBeFalsy()
  })

  test('Should return false if localpart is empty', () => {
    const email: string = '@mail.com'
    expect(Email.validate(email)).toBeFalsy()
  })

  test('Should return false if domain is empty', () => {
    const email: string = 'invalid_email@'
    expect(Email.validate(email)).toBeFalsy()
  })

  test('Should return false if domain is larger than 255 chars', () => {
    const email: string = 'valid_email@' + 'd'.repeat(255) + '.com'
    expect(Email.validate(email)).toBeFalsy()
  })

  test('Should return false if email is larger than 320 chars', () => {
    const email: string = 'a'.repeat(64) + '@' + 'd'.repeat(255) + '.com'
    expect(Email.validate(email)).toBeFalsy()
  })

  test('Should return false if a domain part is larger than 64 chars', () => {
    const email: string = 'any@' + 'd'.repeat(64) + '.' + 'com'
    expect(Email.validate(email)).toBeFalsy()
  })

  test('Should return false if localpart has an invalid chart', () => {
    const email: string = 'any email@main.com'
    expect(Email.validate(email)).toBeFalsy()
  })
})
