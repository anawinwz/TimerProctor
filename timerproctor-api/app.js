import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { corsOrigin } from './utils/const'

require('dotenv-flow').config()

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  console.error('Please specify MongoDB URI.')
  process.exit(1)
}

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})
mongoose.connection.on('error', err => {
  console.error('MongoDB Connection Error', err)
  process.exit(1)
})

const app = express()
app.disable('x-powered-by')
app.use(cors({ 
  origin: corsOrigin,
  credentials: true
}))
app.use(cookieParser())
app.use(express.json({ limit: '4mb' }))
app.disable('etag')


export default app
