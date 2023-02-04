const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const RestaurantList = require('../restaurant_list') // 載入 RestaurantList model
const User = require('../user')
const db = require('../../config/mongoose')
const restaurantListJson = require('../../restaurant.json').results //載入restaurant.json
const SEED_USER = [{
  email: 'user1@example.com',
  password: '12345678',
  ownedRestaurant: [1, 2, 3]
}, {
  email: 'user2@example.com',
  password: '12345678',
  ownedRestaurant: [4, 5, 6]
}]
db.once('open', () => {
  console.log('mongodb connected!')
  Promise.all(SEED_USER.map(SEED_USER =>
    bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(SEED_USER.password, salt))
      .then(hash => User.create({
        email: SEED_USER.email,
        password: hash
      }))
      .then(user => {
        const restaurants = restaurantListJson.filter(restaurant =>
          SEED_USER.ownedRestaurant.includes(restaurant.id))
        restaurants.forEach(restaurant => { restaurant.userId = user._id })
        return RestaurantList.create(restaurants)
      })
  ))
    .then(() => {
      console.log('done')
      process.exit()
    })
    .catch(err => console.log(err))
})