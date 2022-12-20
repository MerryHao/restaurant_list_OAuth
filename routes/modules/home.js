// 引用express & express.Router
const express = require('express')
const router = express.Router()

// 引用RestaurantList Model
const RestaurantList = require('../../models/restaurant_list')

// 定義首頁路由
router.get('/', (req, res) => {
  RestaurantList.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

module.exports = router