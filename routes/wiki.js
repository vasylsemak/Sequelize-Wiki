const router = require('express').Router()
module.exports = router

const { Page, User, createSlug } = require('../models')
const { addPage, wikiPage, main, editPage } = require("../views")


// WIKI
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


// WIKI/ADD
router.get('/add', (req, res) => {
  res.send(addPage())
})


// WIKI/SEARCH
router.get('/search', async(req, res, next) => {
  try {
    const tag = req.query.search
    const pages = await Page.findByTag(tag)

    res.send(main(pages))
  } catch(error) { next(error) }
})


// WIKI/:SLUG
router
  .get('/:slug', async(req, res, next) => {
    try {
      const page = await Page.findOne({
        where: { slug: req.params.slug },
        include: [{ model: User, as: 'author' }]
      })
      res.send(wikiPage(page, page.author))
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
      const page = await Page.findOne({
        where: { slug: req.params.slug },
        include: [{ model: User, as: 'author' }]
      })
      const pagesLeft = await Page.findAll({
        where: { authorId: page.author.id }
      })

      if(pagesLeft.length <= 1) await User.destroy({where: {id: page.author.id}})

      await page.destroy()
      res.status(204).redirect('/wiki')
    } catch(error) { next(error) }
  })


  // WIKI/:SLUG/EDIT
router.get('/:slug/edit', async(req, res, next) => {
  try {
    const page = await Page.findOne({
      where: { slug: req.params.slug },
      include: [{ model: User, as: 'author' }]
    })

    res.send(editPage(page, page.author))
  } catch(error) { next(error) }
})
