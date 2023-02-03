const passport = require('passport')
const User = require('../models/user')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const FacebookStrategy = require('passport-facebook').Strategy
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
      return bcrypt.compare(password, user.password).then(isMatch => {
        if (!isMatch) {
          return done(null, false, { message: 'Email or Password incorrect.' })
        }
        return done(null, user)
      })
    })
    .catch(err => done(err, false))
  }))
  //set facebook strategy
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  }, (accessToken, refreshToken, profile, done) => {
    console.log(profile)
    const { name, email } = profile._json
    User.findOne({ email })
      .then(user => {
        if(user) return done(null, user)
        const randomPassword = Math.random().toString(36).slice(-8)
        bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            name,
            email,
            passport: hash
          }))
          .then(user => done(null, user))
          .catch(err => done(err, false))
      })
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