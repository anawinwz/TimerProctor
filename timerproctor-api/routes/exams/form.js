import { Router } from 'express'
import axios from 'axios'

import { authenticate } from '../../middlewares/authentication'
import { populateExam, onlyDuringExam } from '../../middlewares/exam'

import Exam from '../../models/exam'

import { jsonResponse } from '../../utils/helpers'
import { getDataFromHTML, toForm } from '../../utils/gform'
import { getLastAttempt } from '../../utils/attempt'

const router = Router({ mergeParams: true })

router.get('/', authenticate, populateExam, onlyDuringExam, async (req, res, next) => {
  const { linked = {} } = req.exam
  const { provider, publicURL, cached } = linked
  if (provider !== 'gforms' || !publicURL)
    return res.json(jsonResponse('failed', 'Access Denied.'))

  if (!cached?.data || Date.now() - cached?.updatedAt > 30 * 60) {
    const response = await axios.get(publicURL)
    if (response.status !== 200) throw new Error(`HTTP Status: ${response.status}`)

    const html = response.data
    const data = getDataFromHTML(html)
    const form = toForm(data)
    
    await Exam.findOneAndUpdate({ _id: req.exam._id }, {
      'linked.cached': {
        updatedAt: Date.now(),
        data: form
      }
    }).exec()

    return res.json(jsonResponse('ok', form))
  } else {
    const form = cached.data
    return res.json(jsonResponse('ok', form))
  }
})

router.post('/submit', authenticate, populateExam, async (req, res, next) => {
  const { body, exam, user } = req

  const { _id: userId } = user
  const { _id: examId, linked } = exam
  const lastAttempt = getLastAttempt(examId, userId)

  if (!lastAttempt || lastAttempt.status !== 'started')
    return res.json(jsonResponse('failed', 'คุณไม่ได้รับอนุญาตให้ส่งคำตอบ'))

  const { publicURL, cached } = linked

  if (!cached || !cached.data) 
    return res.json(jsonResponse('failed', 'ไม่พบรายการคำถามของการสอบ หรือคุณส่งคำตอบโดยไม่ได้รับอนุญาต'))

  const { data: { sections } } = cached

  const submitURL = publicURL.replace('/viewform', '/formResponse')

  const submitParams = new URLSearchParams()
  for (const [key, value] of Object.entries(body)) {
    if (key.match(/^answer_\d+$/)) {
      const entry = key.replace('answer_', 'entry.')
      if (Array.isArray(value)) {
        value.map(v => submitParams.append(entry, v))
      } else if (typeof value === 'object' && value !== null) {
        for (const [k, v] of Object.entries(value)) {
          submitParams.append(`${entry}_${k}`, v)
        }
      } else {
        submitParams.append(entry, value)
      }
    }
  }
  submitParams.append('pageHistory', [...Array(sections.length).keys()])

  console.log(submitParams)

  axios.post(submitURL, submitParams, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  .then(async result => {
    const { status } = result
    if (status == 200) {
      lastAttempt.status = 'completed'
      await lastAttempt.save()

      getExamNsp(examId).to('proctor').emit('newTesterStatus', { id: lastAttempt._id, status: 'completed' })

      res.json(jsonResponse('ok'))
    } else {
      console.log('GForms Error(then):', status)
      res.json(jsonResponse('failed'))
    }
  })
  .catch(err => {
    console.log('GForms Error(catch):', err.status)
    res.json(jsonResponse('failed'))
  })
})

export default router
