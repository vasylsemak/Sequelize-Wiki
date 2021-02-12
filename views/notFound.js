const html = require('html-template-tag')
const layout = require('./layout')

module.exports = () => layout(html`
  <h1>Unfortunatelly, this page does not exist!</h1>
  <h3>Please, <a href="/wiki">click here</a> reach Home page</h3>
  `)
