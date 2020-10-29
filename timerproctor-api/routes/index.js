import { Router } from 'express'
import { jsonResponse } from '../utils/helpers'
import exams from './exams'
import users from './users'

const router = Router()

router.get('/', (req, res, next) => {
  return res.json(jsonResponse())
})
router.use('/exams', exams)
router.use('/users', users)

export default router
