/* 校验id格式是否正确的中间件 */
// mongoose.Types.ObjectId.isValid(req.params.id)用来判断一个字符串是不是合法的 MongoDB ObjectId 格式。
const mongoose = require('mongoose')

module.exports = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.json({
      code: '1000',
      msg: 'ID格式错误！',
      data: null
    })
  }
  next()
}