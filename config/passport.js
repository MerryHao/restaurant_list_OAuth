const passport = require('passport')
const User = require('../models/user')
const LocalStrategy = require('passport-local').Strategy
module.exports = app => {
  //initialize passport module
  app.use(passport.initialize())
  app.use(passport.session())
  //set local strategy
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email }).then(user => {
      if(!user) {
        return done(null, false, { message: 'The email is not register!' })
      }
      if(user.password !== password) {
        return done(null, false, { message: 'Email or Password incorrect.' })
      }
      return done(null, user)
    })
    .catch(err => done(err, false))
  }))
  //set serializeUser and deserializeUser
  passport.serializeUser((user, done) => {
    //console.log(user)
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}