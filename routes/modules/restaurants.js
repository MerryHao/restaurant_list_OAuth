// 引入 express and express.Router
const express = require('express')
const router = express.Router()

// 引用RestaurantList Model
const RestaurantList = require('../../models/restaurant_list')

// 進入新增餐廳頁面
router.get('/new', (req, res) => {
  return res.render('new')
})
router.post('/', (req, res) => {
  const userId = req.user._id
  //const body = req.body
  return RestaurantList.create({ ...req.body, userId }) // 存入資料庫
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})

// 瀏覽特定餐廳
router.get('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return RestaurantList.findById({ _id, userId })
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

// 進入修改餐廳頁面
router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  RestaurantList.findOne({ _id, userId })
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

// 修改餐廳
router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  //const body = req.body
  RestaurantList.findByIdAndUpdate({ _id, userId}, req.body)
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch(error => console.log(error))
})

// 刪除餐廳
router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  RestaurantList.findOne({ _id, userId })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router