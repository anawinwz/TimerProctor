import mongoose from 'mongoose'

const { Schema } = mongoose

const schema = new Schema(
  {
    name: String,
    desc: String,
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    linked: {
      provider: { type: String, enum: ['gforms'] },
      id: String,
      publicURL: String,
      cached: {
        updatedAt: Date,
        data: Object
      } 
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
    timeWindow: {
      mode: { type: String, enum: ['realtime', 'schedule'], default: 'realtime' },
      realtime: {
        status: { type: String, enum: ['pending', 'started', 'stopped'], default: 'pending' },
        startedAt: Date,
        stoppedAt: Date
      },
      schedule: {
        startDate: Date,
        endDate: Date
      }
    },
    timer: {
      isShow: { type: Boolean, default: true },
      duration: { type: Number, default: 0 },
    },
    authentication: {
      login: {
        methods: [{ type: String, enum: ['google', 'sso', 'email'], default: 'google' }],
        email: {
          allowedDomains: [{ type: String }]
        },
        sso: {
          CLIENT_ID: String,
          CLIENT_SECRET: String,
          USER_SCOPE: String
        }
      },
      idCheckMode: { type: String, enum: ['none', 'prompt', 'post'], default: 'prompt' }
    }
  }
)

export default mongoose.model('Exam', schema)
