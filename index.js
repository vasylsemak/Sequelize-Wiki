const express = require('express')
const path = require('path')
const morgan = require('morgan')
const methodOverride = require('method-override')

const { db } = require('./models')
const wikiRoute = require('./routes/wiki')
const usersRoute = require('./routes/users')
const notFound = require('./views/notFound')

const app = express()
app.use(morgan('dev'))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, "./public")))
app.use(express.urlencoded({ extended: true }))

app.use('/wiki', wikiRoute)
app.use('/users', usersRoute)

app.get('/', (req, res, next) => {
  try {
    res.redirect('/wiki')
  } catch (err) {
    console.log(err.message)
  }
})

// Error handling
app.use((req, res) => {
  res.status(404).send(notFound())
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal server error')
})


const init = async() => {
  await db.sync()  // {force: true}
  app.listen(3000, () => {
    console.log(`Server is running on port 3000`)
  })
}

init()
