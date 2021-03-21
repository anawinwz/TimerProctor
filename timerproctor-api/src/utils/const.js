export const corsOrigin = ['http://localhost:3000', 'https://timerproctor.anawinwz.me']

export const ioNamespace = /^\/exams\/([a-f\d]{24})$/

export const cookieNames = {
  refreshToken: 'tp__refreshToken',
  refreshToken_admin: 'tp__refreshToken_admin'
}

export const defaultCookieOptions = {
  httpOnly: true,
  domain: '.anawinwz.me'
}
