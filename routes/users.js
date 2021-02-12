const router = require('express').Router()
module.exports = router

const { User } = require('../models')
const userList = require('../views/userList')

router.get('/', async(req, res, next) => {
  try {
    const users = await User.findAll()
    res.send(userList(users))
  } catch(error) {
    next(error)
  }
})
