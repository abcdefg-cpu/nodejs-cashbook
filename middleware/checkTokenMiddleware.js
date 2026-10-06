const jwt = require('jsonwebtoken')
const { SECRET } = require('../config/index')
module.exports = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]
  if (!token) {
    return res.json({
      code: '2003',
      msg: 'token缺失',
      data: null
    })
  }

  jwt.verify(token, SECRET, (err, data) => {
    if (err) {
      return res.json({
        code: '2004',
        msg: 'token校验失败',
        data: null
      })
    }

    // 把用户信息挂到报文里
    req.user = data
    next()
  })
}