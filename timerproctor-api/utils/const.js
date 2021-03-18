export const ioNamespace = /^\/exams\/([a-f\d]{24})$/

export const cookieNames = {
  refreshToken: 'tp__refreshToken',
  refreshToken_admin: 'tp__refreshToken_admin'
}

export const cookieDomain = process.env.COOKIE_DOMAIN || undefined

export const defaultCookieOptions = {
  httpOnly: true,
  domain: cookieDomain
}
