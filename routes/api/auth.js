const express = require('express')
const md5 = require('md5')
const jwt = require('jsonwebtoken')
const userModel = require('../../db/model/userModel')
const { SECRET } = require('../../config/index')

const router = express.Router()

/* 登录 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const data = await userModel.findOne({ username: username, password: md5(password) })
    if (!data) {
      return res.json({
        code: '2001',
        msg: '用户名或密码错误！',
        data: null
      })
    }

    // 登录成功后设置token,向客户端响应token
    const token = jwt.sign({
      username: data.username,
      _id: data._id
    }, SECRET, {
      expiresIn: '7d'// 7天过期
    })

    res.json({
      code: '0000',
      msg: '登录成功！',
      data: token
    })


  } catch (err) {
    console.error('登录失败！')
    console.error(`${err.name}：${err.message}`)
    res.json({
      code: '2002',
      msg: '登录失败！',
      data: null
    })
  }
})

module.exports = router