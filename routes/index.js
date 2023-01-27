// 引入 express and express.Router
const express = require('express')
const router = express.Router()

// 引入home模組程式碼
const home = require('./modules/home')

// 引入restaurants模組程式碼
const restaurants = require('./modules/restaurants')

// 引入restaurants模組程式碼
const users = require('./modules/users')

//將網址結構符合 /users 字串開頭的 request 導向 users 模組
router.use('/users', users)

//將網址結構符合 / 字串的request 導向home模組
router.use('/', home)

// 將網址結構符合 /restaurants 字串開頭的 request 導向 restaurants 模組
router.use('/restaurants', restaurants)



// 準備引入路由模組
// 匯出路由器
module.exports = router