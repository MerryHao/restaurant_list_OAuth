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

// 引用路由器
const routes = require('./routes')

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


// 將request導入路由器
app.use(routes)

// 搜尋餐廳
app.get('/search', (req, res) => {
  const keywords = req.query.keyword.trim()
  RestaurantList.find({ name: new RegExp(keywords, 'i') })
    .lean()
    .then((restaurants) => res.render('index', { restaurants, keywords }))
    .catch(error => console.log(error))
})


//啟動並監聽伺服器
app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`);
})