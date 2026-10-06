const mongoose = require('mongoose')

// 结构对象
const accountSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  time: {
    type: Date,
    required: true,
    default: new Date()
  },
  type: {
    type: Number,
    enum: [-1, 1],
    default: -1
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  remark: {
    type: String,
    trim: true,
    default: ''
  }
})

// 模型对象
const accountModel = mongoose.model('accounts', accountSchema)

module.exports = accountModel