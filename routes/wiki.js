const router = require('express').Router()
module.exports = router
const addPage = require('../views/addPage')
const { Page } = require('../models')

router
  .get('/', (req, res, next) => {
    try {
      res.send('got to GET /wiki/')
    } catch(error) {
      next(error)
    }
  })
  .post('/', async(req, res, next) => {
    try {
      const newPage = {
        title: req.body.title,
        content: req.body.content,
        status: req.body.status
      }
      await Page.create(newPage)
      res.redirect('/')
    } catch(error) {
      next(error)
    }
  })

router.get('/add', (req, res) => {
  res.send(addPage())
})
