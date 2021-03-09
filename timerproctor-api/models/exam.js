import mongoose from 'mongoose'

const { Schema } = mongoose

const schema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    desc: String,
    owner: { 
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    linked: {
      provider: { type: String, enum: ['gforms'] },
      id: String,
      publicURL: String,
      settings: {
        autofill: {
          email: { type: Boolean, enum: false },
          testerId: { type: Boolean, enum: false }
        },
        autofillFields: {
          email: String,
          testerId: String
        }
      },
      cached: {
        updatedAt: Date,
        data: Object
      }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
    maxAttempts: {
      type: Number,
      default: 1,
      min: [1, 'ต้องอนุญาตให้ผู้เข้าสอบทำได้ 1 ครั้งเป็นอย่างน้อย'],
      max: [20, 'สามารถอนุญาตให้ทำได้สูงสุด 20 ครั้ง/คน']
    },
    timeWindow: {
      mode: {
        type: String,
        enum: ['realtime', 'schedule'],
        default: 'realtime'
      },
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
      duration: { 
        type: Number,
        default: 1,
        min: [1, 'ต้องให้เวลาในการทำข้อสอบ 1 นาทีเป็นอย่างน้อย'],
        max: [4320, 'เวลาในการทำข้อสอบต้องไม่เกิน 72 ชั่วโมง']
      }
    },
    authentication: {
      login: {
        methods: {
          type: [{ type: String, enum: ['google', 'sso', 'email'] }],
          default: ['google'],
          validate: {
            validator: v => v.length > 0,
            message: 'คุณต้องเลือกอย่างน้อย 1 ประเภทการล็อกอิน'
          }
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
        content: {
          type: String,
          required: true,
          minLength: [1, 'เนื้อหาประกาศต้องมีอย่างน้อย 1 ตัวอักษร'],
          maxLength: [255, 'เนื้อหาประกาศต้องยาวไม่เกิน 255 ตัวอักษร']
        },
        creator: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        createdAt: { type: Date, default: Date.now },
        seen: { type: Number, default: 0 }
      }],
      default: []
    },
    testerIdMappings: {
      type: [{
        email: String,
        testerId: String
      }]
    }
  }
)

export default mongoose.model('Exam', schema)
