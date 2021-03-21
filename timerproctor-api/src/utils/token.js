import jwt from 'jsonwebtoken'
import { 
  JWT_ADMINAUTH_SECRET,
  JWT_ADMINAUTH_REFRESH_SECRET,
  JWT_AUTH_SECRET,
  JWT_AUTH_REFRESH_SECRET,
  JWT_SOCKET_SECRET
} from '../config'

import RefreshToken from '../models/refreshToken'

export const createAccessToken = (userId, isAdmin = false) =>
  jwt.sign(
    { _id: userId },
    isAdmin ? JWT_ADMINAUTH_SECRET : JWT_AUTH_SECRET,
    { expiresIn: '30m' }
  )

export const createRefreshToken = async (userId, isAdmin = false, addData = false) => {
  const token = jwt.sign(
    { _id: userId },
    isAdmin ? JWT_ADMINAUTH_REFRESH_SECRET : JWT_AUTH_REFRESH_SECRET,
    { expiresIn: '1d' }
  )

  if (addData) {
    await (new RefreshToken({
      user: userId,
      token: token,
      expires: Date.now() + 24 * 3600000
    })).save()
  }
  return token
}

export const createSocketToken = (id, userId, role) => 
  jwt.sign(
    { id, userId, role },
    JWT_SOCKET_SECRET,
    { expiresIn: '5m' }
)

export const getRefreshTokenData = async (token = '') => {
  if (!token) return null

  const data = await RefreshToken.findOne({ token: token, active: true })
  return data
}

export const revokeRefreshToken = async token => {
  if (!token) return false
  
  await RefreshToken.findOneAndUpdate({ token: token }, {
    revoked: Date.now()
  }) 
}

export const replaceRefreshToken = async (userId, oldToken, newToken, expires) => {
  if (typeof oldToken === 'string') {
    RefreshToken.findOneAndUpdate({ token: oldToken }, { 
      revoked: Date.now(),
      replacedByToken: newToken
    })
  } else {
    oldToken.revoked = Date.now()
    oldToken.replacedByToken = newToken
    oldToken.save()
  }
  
  const newTokenData = new RefreshToken({
    user: userId,
    token: newToken,
    expires: expires
  })
  await newTokenData.save()
}
