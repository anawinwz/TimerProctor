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
    maxAttempts: { type: Number, default: 1 },
    timeWindow: {
      mode: { type: String, enum: ['realtime', 'schedule'], default: 'realtime' },
      realtime: {
        status: { type: String, enum: ['pending', 'started', 'stopped'], default: 'pending' },
        allowLogin: { type: Boolean, default: true },
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
        methods: {
          type: [{ type: String, enum: ['google', 'sso', 'email'] }],
          default: ['google']
        },
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
    },
    announcements: {
      type: [{ 
        content: String,
        creator: { type: Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now },
        seen: { type: Number, default: 0 }
      }],
      default: []
    }
  }
)

export default mongoose.model('Exam', schema)
