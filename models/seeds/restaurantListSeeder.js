const mongoose = require('mongoose')
const RestaurantList = require('../restaurant_list') // 載入 RestaurantList model
const restaurantListJson = require('../../restaurant.json').results //載入restaurant.json
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
  RestaurantList.create(restaurantListJson)
    .then(() => {
      console.log('restaurant seeder has been updated!')
      db.close()
    })
    .catch(error => console.log(error))
})