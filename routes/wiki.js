const router = require('express').Router()
module.exports = router

const { Page, User, createSlug } = require('../models')
const addPage = require('../views/addPage')
const wikipage = require('../views/wikipage')
const main = require('../views/main')
const editPage = require('../views/editPage')


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


router
  .get('/:slug', async(req, res, next) => {
    try {
      const page = await Page.findOne({
        where: { slug: req.params.slug }
      })

      if(!page.id) return res.status(404).send('No page found with this title')
      const pageAuthor = await page.getAuthor()
      res.send(wikipage(page, pageAuthor))
    } catch(error) { next(error) }
  })
  .put('/:slug', async(req, res, next) => {
    try {
      const page = await Page.findOne({
        where: { slug: req.params.slug }
      })

      const updatedPage = req.body
      updatedPage.slug = createSlug(req.body.title)

      await page.update(updatedPage)
      res.redirect('/wiki/' + updatedPage.slug)
    } catch(error) { next(error) }
  })
  .delete('/:slug', async(req, res, next) => {
    try {
      const rowsDeleted = await Page.destroy({
        where: { slug: req.params.slug }
      })
      res.redirect('/wiki')
    } catch(error) { next(error) }
  })


router.get('/:slug/edit', async(req, res, next) => {
  try {
    const page = await Page.findOne({
      where: { slug: req.params.slug }
    })

    if(!page.id) return res.status(404).send('No page found with this title')
    const pageAuthor = await page.getAuthor()
    res.send(editPage(page, pageAuthor))
  } catch(error) { next(error) }
})
