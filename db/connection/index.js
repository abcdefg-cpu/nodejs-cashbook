const mongoose = require('mongoose')
const { DB_HOST, DB_PORT, DB_DATABASE } = require('../../config/index')

/* 监听运行中的接连状态 */
mongoose.connection.on('error', err => {
  console.error('运行中连接错误！');
  console.error(`${err.name}：${err.message}`);
})

mongoose.connection.on('disconnect', () => {
  console.error('运行中连接断开！');
})

/* 连接成功函数 */
const connectDB = async () => {
  await mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`)
}

module.exports = connectDB