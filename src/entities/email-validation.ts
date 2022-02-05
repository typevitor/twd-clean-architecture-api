export class Email {
  static validate (email: string): boolean {
    if (!email) {
      return false
    }
    const [localpart, domain] = email.split('@')
    console.log(domain)
    if (localpart.length > 64) return false
    return true
  }
}
