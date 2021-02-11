const express = require('express')
const app = express()
const path = require('path')
const PORT = 3000
const morgan = require('morgan')
const layout = require('./views/layout')

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


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
