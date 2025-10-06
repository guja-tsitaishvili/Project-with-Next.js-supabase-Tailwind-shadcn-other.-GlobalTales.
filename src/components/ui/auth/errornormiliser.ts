    type AuthErr = 'invalid-email' | 'weak-password' | 'already-registered' | 'unknown'


    export function mapSignUPError(e:  {message: string}): AuthErr{

    const m = e.message.toLowerCase()

    if (m.includes('already registered') || m.includes('user already exists')){
        return 'already-registered'
    }

    if (
        m.includes('password') && 
        (m.includes('weak')  ||
        m.includes('at least') ||
        m.includes('too short') ||
        m.includes('not strong'))
      ) 
        {
        return 'weak-password'
    }
    if (m.includes('invalid email') || m.includes('email is invalid') || m.includes('email address is invalid')) {
    return 'invalid-email'
  }
  return 'unknown'
    }
    export function uiMessage(err: AuthErr): string {
  switch (err) {
    case 'invalid-email':      return 'Please enter a valid email address.'
    case 'weak-password':      return 'Password is too weak. Use a longer, stronger password.'
    case 'already-registered': return 'This email is already registered. Try signing in.'
    default:                   return 'Something went wrong. Please try again.'
  }
}


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: string) {
  return emailRegex.test(email)
}

// Example policy: ≥8 chars, at least one letter & one number
export function validatePassword(pw: string) {
  return pw.length >= 8 && /[A-Za-z]/.test(pw) && /\d/.test(pw)
}
