// 引用express & express.Router
const express = require('express')
const router = express.Router()

// 引用RestaurantList Model
const RestaurantList = require('../../models/restaurant_list')

// 定義首頁路由
router.get('/', (req, res) => {
  const userId = req.user._id
  RestaurantList.find({ userId })
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

// 搜尋餐廳
router.get('/search', (req, res) => {
  const keywords = req.query.keyword.trim()
  RestaurantList.find({ name: new RegExp(keywords, 'i') })
    .lean()
    .then((restaurants) => res.render('index', { restaurants, keywords }))
    .catch(error => console.log(error))
})

module.exports = router