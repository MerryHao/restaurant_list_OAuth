const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true,
}))

router.post('/register', (req, res) => {
  //取得註冊表單參數
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  //檢查使否已註冊過
  if (!email) {
    errors.push({ message: 'Email is required!' })
  }
  if (!password ) {
    errors.push({ message: 'Password required!' })
  }
  if (!confirmPassword) {
    errors.push({ message: 'Confirm Password is required!' })
  }
  if(password !== confirmPassword) {
    errors.push({message: 'password and confirm password are not the same!'})
  }
  if(errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }
  User.findOne({ email }).then(user => {
    //如果已經註冊過
    if (user) {
      //console.log('user already exist.')
      errors.push({message: 'This email is already exist!'})
      res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    }
    User.create({
      name,
      email,
      password,
    })
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  })
    .catch(err => console.log(err))
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', 'Logout success!')
  res.redirect('/users/login')
})
module.exports = router