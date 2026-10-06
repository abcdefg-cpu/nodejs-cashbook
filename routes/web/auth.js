const express = require('express');
const router = express.Router();
const md5 = require('md5')
const userModel = require('../../db/model/userModel')

/* 注册 */
/* 注册页面 */
router.get('/reg', (req, res) => {
  res.render('auth/reg')
})

/* 提交注册 */
router.post('/reg', async (req, res) => {
  // 1. 把用户注册的信息存入用户信息的数据库中，并且把密码加密
  try {
    await userModel.create({ ...req.body, password: md5(req.body.password) })
    res.render('success', { msg: '注册成功！', resUrl: '/login' })
  } catch (err) {
    console.error('注册失败！')
    console.error(`${err.name}：${err.message}`)
    res.render('fail', { msg: '注册失败！', resUrl: '/reg' })
  }
})

/* 登录 */
/* 登录页面 */
router.get('/login', (req, res) => {
  res.render('auth/login')
})

/* 提交登录 */
router.post('/login', async (req, res) => {
  console.log(req.body);
  // 1. 把提交的用户信息与数据库中的用户信息比对，看是否存在(密码要比对加密过的密码)
  try {
    const { username, password } = req.body
    const data = await userModel.findOne({ username: username, password: md5(password) })
    if (!data) {
      return res.render('fail', { msg: '请先注册！', resUrl: '/reg' })
    }
    // 2. 登录成功后要保存session
    req.session.username = data.username
    req.session._id = data._id
    res.render('success', { msg: '登录成功！', resUrl: '/account' })
  } catch (err) {
    console.error('登录失败！')
    console.error(`${err.name}：${err.message}`)
    res.render('fail', { msg: '登录失败！', resUrl: '/login' })
  }
})

/* 退出登录 */
// 为了防止 CSRF 跨站请求伪造，用 POST/PUT/DELETE 代替 GET（简单的方式）
router.post('/logout', async (req, res) => {
  await req.session.destroy(() => {
    res.clearCookie('sid') // 删除cookie
    res.render('success', { msg: '退出成功！', resUrl: '/login' })
  })
})
module.exports = router;
