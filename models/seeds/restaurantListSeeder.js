const RestaurantList = require('../restaurant_list') // 載入 RestaurantList model
const db = require('../../config/mongoose')
const restaurantListJson = require('../../restaurant.json').results //載入restaurant.json

db.once('open', () => {
  console.log('mongodb connected!')
  RestaurantList.create(restaurantListJson)
    .then(() => {
      console.log('restaurant seeder has been updated!')
      db.close()
    })
    .catch(error => console.log(error))
})