/* --- Adapted from https://github.com/auth0-community/auth0-socketio-jwt/blob/master/lib/index.js -- */
import jwt from 'jsonwebtoken'

class UnauthorizedError extends Error {
  constructor(code, error) {
    super(error.message)
    this.name = 'UnauthorizedError'
    this.inner = error
    this.data = {
      message: this.message,
      code: code,
      type: 'UnauthorizedError'
    }
  }
}

const getSecret = (request, secret, token, callback) => {
  if (typeof secret === 'function') {
    if (!token) {
      return callback({ code: 'invalid_token', message: 'jwt must be provided' })
    }

    const parts = token.split('.')

    if (parts.length < 3) {
      return callback({ code: 'invalid_token', message: 'jwt malformed' })
    }

    if (parts[2].trim() === '') {
      return callback({ code: 'invalid_token', message: 'jwt signature is required' })
    }

    let decodedToken = jwt.decode(token, { complete: true })

    if (!decodedToken) {
      return callback({ code: 'invalid_token', message: 'jwt malformed' })
    }

    const arity = secret.length
    if (arity == 4) {
      secret(request, decodedToken.header, decodedToken.payload, callback)
    } else { // arity == 3
      secret(request, decodedToken.payload, callback)
    }
  } else {
    callback(null, secret)
  }
}

const noQsMethod = (options = {}) => {
  const defaults = { required: true }
  options = Object.assign({}, options, defaults)

  return (socket) => {
    const server = socket.server || this?.server

    let auth_timeout = null
    if (options.required) {
      auth_timeout = setTimeout(() => {
        socket.disconnect('unauthorized')
      }, options.timeout || 5000)
    }

    socket.on('authenticate', (data) => {
      if (options.required) {
        clearTimeout(auth_timeout)
      }

      // error handler
      const onError = (err, code) => {
        if (err) {
          code        = code || 'unknown'
          const error = new UnauthorizedError(code, {
            message: (Object.prototype.toString.call(err) === '[object Object]' && err.message) ? err.message : err
          })

          let callback_timeout
          // If callback explicitly set to false, start timeout to disconnect socket
          if (options.callback === false || typeof options.callback === 'number') {
            if (typeof options.callback === 'number') {
              if (options.callback < 0) {
                // If callback is negative(invalid value), make it positive
                options.callback = Math.abs(options.callback)
              }
            }

            callback_timeout = setTimeout(() => {
              socket.disconnect('unauthorized')
            }, (options.callback === false ? 0 : options.callback))
          }

          socket.emit('unauthorized', error, () => {
            if (typeof options.callback === 'number') {
              clearTimeout(callback_timeout)
            }
            socket.disconnect('unauthorized')
          })
          return // stop logic, socket will be close on next tick
        }
      }

      const token = options.cookie ? socket.request.cookies[options.cookie] : (data ? data.token : undefined)

      if (!token || typeof token !== 'string') {
        return onError({ message: 'invalid token datatype' }, 'invalid_token')
      }

      // Store encoded JWT
      socket[options.encodedPropertyName] = token

      const onJwtVerificationReady = (err, decoded) => {
        if (err) {
          return onError(err, 'invalid_token')
        }

        // success handler
        const onSuccess = () => {
          socket[options.decodedPropertyName] = options.customDecoded
            ? options.customDecoded(decoded)
            : decoded
          socket.emit('authenticated')
        }

        if (options.additional_auth && typeof options.additional_auth === 'function') {
          options.additional_auth(decoded, onSuccess, onError, socket)
        } else {
          onSuccess()
        }
      }

      const onSecretReady = (err, secret) => {
        if (err || !secret) {
          return onError(err, 'invalid_secret')
        }

        jwt.verify(token, secret, options, onJwtVerificationReady)
      }

      getSecret(socket.request, options.secret, token, onSecretReady)
    })
  }
}

export const authorize = (options = {}) => {
  options = Object.assign({}, options, {
    decodedPropertyName: 'decoded_token',
    encodedPropertyName: 'encoded_token'
  })

  if (typeof options.secret !== 'string' && typeof options.secret !== 'function') {
    throw new Error(`Provided secret ${options.secret} is invalid, must be of type string or function.`)
  }

  if (!options.handshake) {
    return noQsMethod(options)
  }
}
