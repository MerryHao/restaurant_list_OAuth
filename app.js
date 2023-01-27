//載入express並將express存進app變數
const express = require('express')
const session = require('express-session')
const usePassport = require('./config/passport')
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

require('./config/mongoose')

// 把樣板引擎交給express-handlebars
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(session({
  secret: 'ThisIsSecret',
  resave: false,
  saveUninitialized: true
}))
// 告訴express靜態檔案夾的位置
app.use(express.static('public'))

// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(express.urlencoded({ extended: true }))

app.use(methodOverride('_method'))

usePassport(app)
// 將request導入路由器
app.use(routes)




//啟動並監聽伺服器
app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`);
})