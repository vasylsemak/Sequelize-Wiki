const router = require('express').Router()
module.exports = router

const addPage = require('../views/addPage')
const { Page } = require('../models')
const wikipage = require('../views/wikipage')

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
      const newPage =  await Page.create(req.body)
      res.redirect(`/wiki/${newPage.slug}`)
    } catch(error) {
      next(error)
    }
  })

router.get('/add', (req, res) => {
  res.send(addPage())
})

router.get('/:slug', async (req, res, next) => {
  try {
    const foundPage = await Page.findOne({
      where: { slug: req.params.slug }
    })
    res.send(wikipage(foundPage))
  } catch(error) {
    next(error)
  }
})
