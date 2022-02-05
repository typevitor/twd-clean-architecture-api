export class Email {
  static validate (email: string): boolean {
    if (!email) {
      return false
    }
    if (email.length > 320) {
      return false
    }
    const [localpart, domain] = email.split('@')
    if (localpart.length === 0 || localpart.length > 64) return false
    if (domain.length === 0 || domain.length > 255) return false
    return true
  }
}
