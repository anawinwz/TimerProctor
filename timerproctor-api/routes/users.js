import { Router } from 'express'
import { jsonResponse, wsBroadcast } from '../utils/helpers'

const fs = require('fs')

const router = Router()

router.post('/submitIDCheck' , (req, res, next) => {
  const userId = req.body.userId
  const image = req.body.image.replace('data:image/png;base64,', '')

  const fileName = `${userId}_${Date.now()}.png`
  const filePath = `idphotos/${fileName}`
  const imageURL = `http://localhost:5000/${filePath}`
  fs.writeFile(filePath, image, 'base64', function (err) {})
  req.app.locals.users[1234] = {
    displayName: 'anawin wongsadit',
    accepted: null,
    reason: '',
    imageURL: imageURL
  }
  wsBroadcast(req.app, { type: 'newIdCheckReq', payload: { userId: 1234, imageURL: imageURL } }, 'proctors')  
  return res.json(jsonResponse('ok'))
})

router.post('/1234/approve', (req, res, next) => {
  req.app.locals.users[1234].accepted = true
  req.app.locals.users[1234].reason = ''
  wsBroadcast(req.app, { type: 'idCheckResponse', payload: { accepted: true } }, 'testtakers')
  return res.json(jsonResponse('ok'))
})

router.post('/1234/reject', (req, res, next) => {
  const reason = req.body?.reason
  req.app.locals.users[1234].accepted = false
  req.app.locals.users[1234].reason = reason
  wsBroadcast(req.app, { type: 'idCheckResponse', payload: { accepted: false, reason: reason } }, 'testtakers')
  return res.json(jsonResponse('ok'))
})

export default router