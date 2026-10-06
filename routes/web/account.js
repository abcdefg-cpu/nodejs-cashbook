const express = require('express')
const dayjs = require('dayjs')

const accountModel = require('../../db/model/accountModel')
const checkSessionMiddleware = require('../../middleware/checkSessionMiddleware')

const router = express.Router()

// 检测是否有用户的session，如果有可以正常展示页面、进行操作；如果没有就返回到登录页面
router.use(checkSessionMiddleware)

/* 展示账户列表 */
router.get('/', async (req, res) => {
  const list = await accountModel.find({}).sort({ time: -1 })
  // 计算金额总数：
  // acc为累计器，初始值设置为0，遇到type为-1的就减，遇到type为1的就加
  const totalAmount = list.reduce((acc, item) => {
    if (item.type === -1) return acc - item.amount
    if (item.type === 1) return acc + item.amount
    return acc
  }, 0)

  res.render('account', { list, totalAmount, dayjs })
})

/* 展示添加页面 */
router.get('/create', (req, res) => {
  res.render('create')
})

/* 添加记录 */
router.post('/', async (req, res) => {
  try {
    await accountModel.create({ ...req.body, time: new Date(req.body.time) })
    res.render('success', { msg: '添加成功！', resUrl: '/account' })
  } catch (err) {
    console.error('添加失败：', `${err.name}：${err.message}`);
    res.render('fail', { msg: '添加失败！', resUrl: '/account' })
  }
})

/* 删除记录 */
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const deleteRes = await accountModel.deleteOne({ _id: id })
    // 因为mongoose匹配不到的话不会抛出错误，只会响应deletedCount：0（update同理）
    // 比如：mongoose会自动创建id，属性名为'_id'，如果这里写成 const deleteRes = await accountModel.deleteOne({ id })，mongoose匹配不到'id'的属性，但是mongoose并不会抛出错误，而是会返回结果{ acknowledged: true, deletedCount: 0 }。导致的后果是页面会渲染success.ejs但是数据库并不会删除任何一条数据。因此需要对deletedCount进行判断，如果为0，说明并没有匹配到相关属性。
    if (deleteRes.deletedCount === 0) {
      return res.render('fail', { msg: '记录不存在！', resUrl: '/account' })
    }
    res.render('success', { msg: '删除成功！', resUrl: '/account' })
  } catch (err) {
    console.error('删除失败：', `${err.name}：${err.message}`);
    res.render('fail', { msg: '删除失败！', resUrl: '/account' })
  }
})


module.exports = router