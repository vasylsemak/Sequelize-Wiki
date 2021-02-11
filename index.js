const express = require('express')
const app = express()
const path = require('path')
const PORT = 3000
const morgan = require('morgan')

const layout = require('./views/layout')
const { db } = require('./models')
const wikiRoute = require('./routes/wiki')
const usersRoute = require('./routes/users')

app.use(morgan('dev'))
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
app.use((req, res, next) => {
  let err = new Error('No such a page on our website!!!')
  err.status(404)
  next(err)
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal server error')
})


const init = async() => {
  await db.authenticate()
    .then(() => {
      console.log('connected to database')
    })
  await db.sync()  // {force: true}

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

init()
