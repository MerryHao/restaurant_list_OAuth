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
  return RestaurantList.create(req.body) // 存入資料庫
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})

// 瀏覽特定餐廳
router.get('/:id', (req, res) => {
  const { id } = req.params
  return RestaurantList.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

// 修改餐廳
router.get('/:id/edit', (req, res) => {
  const { id } = req.params
  RestaurantList.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

// 新增餐廳
router.post('/:id/edit', (req, res) => {
  const { id } = req.params
  RestaurantList.findByIdAndUpdate(id, req.body)
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

// 刪除餐廳
router.delete('/:id', (req, res) => {
  const { id } = req.params
  RestaurantList.findByIdAndDelete(id)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router