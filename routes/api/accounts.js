const express = require('express')
const accountModel = require('../../db/model/accountModel')
const validateIdMiddleware = require('../../middleware/validateIdMiddleware')
const checkTokenMiddleware = require('../../middleware/checkTokenMiddleware')
const router = express.Router()


/* 获取账单列表 */
router.get('/accounts', checkTokenMiddleware, async (req, res) => {
  try {
    const accountList = await accountModel.find({}).sort({ time: -1 })
    res.json({
      code: '0000',
      msg: '获取成功！',
      data: accountList
    })
  } catch (err) {
    console.error('获取失败！')
    console.error(`${err.name}：${err.message}`)
    res.json({
      code: '1002',
      msg: '获取失败！',
      data: null
    })
  }
})

/* 获取单个账单 */
router.get('/accounts/:id', checkTokenMiddleware, validateIdMiddleware, async (req, res) => {
  try {
    const id = req.params.id
    const account = await accountModel.findById(id)
    if (!account) {
      return res.json({
        code: '1001',
        msg: 'id不存在！',
        data: null
      })
    }
    res.json({
      code: '0000',
      msg: '获取成功！',
      data: account
    })
  } catch (err) {
    console.error('获取失败！')
    console.error(`${err.name}：${err.message}`)
    res.json({
      code: '1003',
      msg: '获取失败！',
      data: null
    })
  }
})

/* 新增账单 */
router.post('/accounts', checkTokenMiddleware, async (req, res) => {
  try {
    const dateObj = new Date(req.body.time)
    const account = await accountModel.create({ ...req.body, time: dateObj })
    res.json({
      code: '0000',
      msg: '添加成功！',
      data: account
    })
  } catch (err) {
    console.error('添加失败！')
    console.error(`${err.name}：${err.message}`)
    res.json({
      code: '1004',
      msg: '添加失败！',
      data: null
    })
  }
})

/* 更新账单 */
router.patch('/accounts/:id', checkTokenMiddleware, validateIdMiddleware, async (req, res) => {
  try {
    const id = req.params.id
    const account = await accountModel.findByIdAndUpdate(id, req.body, { new: true })
    if (!account) {
      return res.json({
        code: '1001',
        msg: 'id不存在！',
        data: null
      })
    }
    res.json({
      code: '0000',
      msg: '更新成功！',
      data: account
    })

  } catch (err) {
    console.error('更新失败！')
    console.error(`${err.name}：${err.message}`)
    res.json({
      code: '1005',
      msg: '更新失败！',
      data: null
    })
  }
})

/* 删除账单 */
router.delete('/accounts/:id', checkTokenMiddleware, validateIdMiddleware, async (req, res) => {
  try {
    const id = req.params.id
    const data = await accountModel.findByIdAndDelete(id)
    if (!data) {
      return res.json({
        code: '1006',
        msg: '找不到这条记录！',
        data: null
      })
    }
    res.json({
      code: '0000',
      msg: '删除成功！',
      data: null
    })
  } catch (err) {
    console.error('删除失败！')
    console.error(`${err.name}：${err.message}`)
    res.json({
      code: '1007',
      msg: '删除失败！',
      data: null
    })

  }
})


module.exports = router