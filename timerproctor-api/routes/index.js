import { Router } from 'express'
import { jsonResponse } from '../utils/helpers'

const router = Router()

router.get('/', (req, res, next) => {
  return res.json(jsonResponse())
})

export default router
