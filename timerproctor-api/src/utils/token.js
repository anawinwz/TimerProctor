import jwt from 'jsonwebtoken'
import { 
  JWT_ADMINAUTH_SECRET,
  JWT_ADMINAUTH_REFRESH_SECRET,
  JWT_AUTH_SECRET,
  JWT_AUTH_REFRESH_SECRET,
  JWT_SOCKET_SECRET
} from '../config'

export const createAccessToken = (userId, isAdmin = false) =>
  jwt.sign(
    { _id: userId },
    isAdmin ? JWT_ADMINAUTH_SECRET : JWT_AUTH_SECRET,
    { expiresIn: '30m' }
  )

export const createRefreshToken = (userId, isAdmin = false) =>
  jwt.sign(
    { _id: userId },
    isAdmin ? JWT_ADMINAUTH_REFRESH_SECRET : JWT_AUTH_REFRESH_SECRET,
    { expiresIn: '1d' }
  )

export const createSocketToken = (id, userId, role) => 
  jwt.sign(
    { id, userId, role },
    JWT_SOCKET_SECRET,
    { expiresIn: '5m' }
)
