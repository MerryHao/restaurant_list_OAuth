//載入express並將express存進app變數
const express = require('express')
const app = express()

//定義測試用的port: 3000
const port = 3000

//載入express-handlebars
const exphbs = require('express-handlebars')

// 載入 RestaurantList model
const RestaurantList = require('./models/restaurant_list') 

// 載入method override
const methodOverride = require('method-override')

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

// 把樣板引擎交給express-handlebars
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// 告訴express靜態檔案夾的位置
app.use(express.static('public'))

// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(express.urlencoded({ extended: true }))

app.use(methodOverride('_method'))

// 路由設定
app.get('/', (req,res) => {
  RestaurantList.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})


// 搜尋餐廳
app.get('/search', (req, res) => {
  const keywords = req.query.keyword.trim()
  RestaurantList.find({ name: new RegExp(keywords, 'i') })
    .lean()
    .then((restaurants) => res.render('index', { restaurants, keywords }))
    .catch(error => console.log(error))
})

// 進入新增餐廳頁面
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})
app.post('/restaurants', (req, res) => {
  return RestaurantList.create(req.body) // 存入資料庫
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})

// 瀏覽特定餐廳
app.get('/restaurants/:id', (req, res) => {
  const { id } = req.params
  return RestaurantList.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

// 修改餐廳
app.get('/restaurants/:id/edit', (req, res) => {
  const { id } = req.params
  RestaurantList.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

// 新增餐廳
app.post('/restaurants/:id/edit', (req, res) => {
  const { id } = req.params
  RestaurantList.findByIdAndUpdate(id, req.body)
    .then(() => res.redirect(`/restaurants/${ id}`))
    .catch(error => console.log(error))
})

// 刪除餐廳
app.delete('/restaurants/:id', (req, res) => {
  const { id } = req.params
  RestaurantList.findByIdAndDelete(id)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//啟動並監聽伺服器
app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`);
})