//載入express並將express存進app變數
const express = require('express')
const app = express()

//定義測試用的port: 3000
const port = 3000

//載入express-handlebars
const exphbs = require('express-handlebars')

//載入restaurant.json
const restaurantList = require('./restaurant.json')

//僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

//載入mongoose並設定連線到mongoDB
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

//取得資料庫連線狀態
const db = mongoose.connection
//連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

//把樣板引擎交給express-handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// 告訴express靜態檔案夾的位置
app.use(express.static('public'))


//路由設定
app.get('/', (req,res) => {
  res.render('index', {restaurants: restaurantList.results})
})

app.get('/restaurants/:restaurant_id', (req,res) => {
  
  const restaurant = restaurantList.results.find(restaurant => 
    restaurant.id.toString() === req.params.restaurant_id
  )
  res.render('show', {restaurant: restaurant})
})

app.get('/search', (req,res) => {
  const keyword = req.query.keyword
  const restaurants = restaurantList.results.filter(restaurant => 
    restaurant.name.includes(keyword) ||
    restaurant.category.includes(keyword))
  res.render('index', {restaurants: restaurants, keyword: keyword})
})

//啟動並監聽伺服器
app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`);
})