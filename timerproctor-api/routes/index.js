import { Router } from 'express'
import { jsonResponse } from '../utils/helpers'
import exams from './exams'

const router = Router()

router.get('/', (req, res, next) => {
  return res.json(jsonResponse())
})
router.use('/exams', exams)

export default router
