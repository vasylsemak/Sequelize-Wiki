const router = require('express').Router()
module.exports = router

const addPage = require('../views/addPage')
const { Page, User } = require('../models')
const wikipage = require('../views/wikipage')
const main = require('../views/main')

router
  .get('/', async(req, res, next) => {
    try {
      const allPages = await Page.findAll()
      res.send(main(allPages))
    } catch(error) { next(error) }
  })
  .post('/', async(req, res, next) => {
    try {
      const newPage =  await Page.create(req.body)
      const [ user, wasCreated ] = await User.findOrCreate({
        where: {
          name: req.body.name,
          email: req.body.email
        }
      })

      await newPage.setAuthor(user)
      res.redirect(`/wiki/${newPage.slug}`)
    } catch(error) { next(error) }
  })

router.get('/add', (req, res) => {
  res.send(addPage())
})

router.get('/:slug', async (req, res, next) => {
  try {
    const page = await Page.findOne({
      where: { slug: req.params.slug }
    })
    const pageAuthor = await page.getAuthor()
    res.send(wikipage(page, pageAuthor))
  } catch(error) { next(error) }
})
