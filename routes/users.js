const router = require('express').Router()
module.exports = router

const { User, Page } = require('../models')
const userList = require('../views/userList')
const userPages = require('../views/userPages')

router.get('/', async(req, res, next) => {
  try {
    const users = await User.findAll()
    res.send(userList(users))
  } catch(error) { next(error) }
})

router.get('/:id', async(req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id)

    if(!user.id) return res.status(404).send('No user with this name!')
    else {
      const pages = await Page.findAll({
        where: { authorId: user.id }
      })
      res.send(userPages(user, pages))
    }
  } catch(error) { next(error) }
})
