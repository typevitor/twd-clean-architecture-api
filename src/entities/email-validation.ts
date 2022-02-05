export class Email {
  static validate (email: string): boolean {
    if (!email) {
      return false
    }
    if (email.length > 320) {
      return false
    }
    const [localpart, domain] = email.split('@')
    console.log(domain)
    if (localpart.length > 64) return false
    return true
  }
}
