import { Router } from 'express'
import axios from 'axios'

import { authenticate } from '../../middlewares/authentication'
import { populateExam, onlyDuringExam } from '../../middlewares/exam'

import Exam from '../../models/exam'

import { jsonResponse, getExamNsp } from '../../utils/helpers'
import { cleanFormForTesters, getDataFromHTML, toForm } from '../../utils/gform'
import { getLastAttempt } from '../../utils/attempt'

const router = Router({ mergeParams: true })

router.get('/', authenticate, populateExam, onlyDuringExam, async (req, res) => {
  const { _id: userId } = user
  const { _id: examId, linked = {} } = req.exam

  const lastAttempt = await getLastAttempt(examId, userId)
  if (!lastAttempt || !['started', 'authenticated'].includes(lastAttempt.status))
    return res.json(jsonResponse('failed', 'คุณไม่สามารถเข้าถึงเนื้อหาการสอบได้'))

  const { provider, publicURL, cached, settings } = linked
  if (provider !== 'gforms' || !publicURL)
    return res.json(jsonResponse('failed', 'Access Denied.'))

  const hideFields = Object.values(settings?.autofillFields || {}).map(field => String(field))
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

    return res.json(jsonResponse('ok', cleanFormForTesters(form, { hideFields }) ))
  } else {
    const form = cached.data
    return res.json(jsonResponse('ok', cleanFormForTesters(form, { hideFields }) ))
  }
})

router.post('/responses', authenticate, populateExam, async (req, res) => {
  const { body, exam, user } = req

  const { _id: userId } = user
  const { _id: examId, linked, testerIdMappings = [] } = exam
  const lastAttempt = await getLastAttempt(examId, userId)

  if (!lastAttempt || lastAttempt.status !== 'started')
    return res.json(jsonResponse('failed', 'คุณไม่ได้รับอนุญาตให้ส่งคำตอบ'))

  const { publicURL, cached } = linked

  if (!cached || !cached.data) 
    return res.json(jsonResponse('failed', 'ไม่พบรายการคำถามของการสอบ หรือคุณส่งคำตอบโดยไม่ได้รับอนุญาต'))

  const { data: { fields, sections } } = cached

  const autofill = Object.entries(linked?.settings?.autofill || {})
    .filter(([_, value]) => value === true)
    .map(([key, _]) => key)

  const autofillFields = linked.settings?.autofillFields || {}

  let bodyEntries = []
  for (const type of autofill) {
    const fId = autofillFields?.[type]
    if (!fId) continue

    const field = fields.find(field => field.fId == fId)
    if (!field) continue

    const entryKey = `answer_${field.id}`
    delete body?.[entryKey]

    let entryValue = ''
    if (type === 'email') entryValue = user.email
    else if (type === 'testerId') {
      const mapping = testerIdMappings.find(mapping => String(mapping.email) === String(user.email))
      entryValue = mapping?.testerId || ''
    }

    bodyEntries.push([entryKey, entryValue])
  }
  bodyEntries = [...bodyEntries, ...Object.entries(body)]
  
  const submitParams = new URLSearchParams()
  for (const [key, value] of bodyEntries) {
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
  
  const submitURL = publicURL.replace('/viewform', '/formResponse')
  axios.post(submitURL, submitParams, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  .then(async result => {
    const { status } = result
    if (status == 200) {
      lastAttempt.status = 'completed'
      await lastAttempt.save()

      getExamNsp(examId).to('proctor').emit('testerUpdate', { id: lastAttempt._id, updates: { status: 'completed' } })

      res.json(jsonResponse('ok'))
    } else {
      console.log('GForms Error(then):', status)
      res.json(jsonResponse('failed'))
    }
  })
  .catch(err => {
    console.log('GForms Error(catch):', err)
    res.json(jsonResponse('failed'))
  })
})

export default router
