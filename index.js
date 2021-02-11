const express = require('express')
const app = express()
const path = require('path')
const PORT = 3000
const morgan = require('morgan')

const layout = require('./views/layout')
const { db } = require('./models')

app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, "./public")))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  try {
    res.send(layout("Hello world!!!"))
  } catch (err) {
    console.log(err.message)
  }
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
