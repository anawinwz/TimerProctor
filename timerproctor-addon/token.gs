// Ref: https://www.labnol.org/code/json-web-token-201128
const createJwt = ({ privateKey, expiresInHours = 1, data = {} }) => {
  // Sign token using HMAC with SHA-256 algorithm
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  }

  const now = Date.now()
  const expires = new Date(now)
  expires.setHours(expires.getHours() + expiresInHours)

  // iat = issued time, exp = expiration time
  const payload = {
    exp: Math.round(expires.getTime() / 1000),
    iat: Math.round(now / 1000)
  }

  // add data payload
  Object.keys(data).forEach(function (key) {
    payload[key] = data[key]
  })

  const base64Encode = (text, json = true) => {
    const data = json ? JSON.stringify(text) : text
    const base64 = (typeof data !== 'string') ? Utilities.base64EncodeWebSafe(data) : Utilities.base64EncodeWebSafe(data, Utilities.Charset.UTF_8)
    return base64.replace(/=+$/, '')
  }

  const toSign = `${base64Encode(header)}.${base64Encode(payload)}`
  const signatureBytes = Utilities.computeHmacSha256Signature(
    toSign,
    privateKey
  )
  const signature = base64Encode(signatureBytes, false)
  return `${toSign}.${signature}`
}

const genToken = (payload = {}) => createJwt({
  privateKey: 'GAPPS_SECRET', //replace with your JWT_GAPPS_SECRET
  data: payload
})
