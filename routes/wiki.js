const router = require('express').Router()
module.exports = router
const addPage = require('../views/addPage')

router
  .get('/', (req, res, next) => {
    try {
      res.send('got to GET /wiki/')
    } catch(error) {
      next(error)
    }
  })
  .post('/', (req, res, next) => {
    try {
      res.send(req.body)
    } catch(error) {
      next(error)
    }
  })

router.get('/add', (req, res) => {
  res.send(addPage())
})
