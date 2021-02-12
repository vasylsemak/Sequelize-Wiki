const Sequelize = require('sequelize')
const db = new Sequelize('postgres://localhost:5432/wikistack', {
  logging: false
})

db.authenticate().then(() => {
  console.log('connected to database')
})

const Page = db.define('page', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM('open', 'closed'),
    defaultValue: 'closed'
  }
})

const User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      isEmail: true
    }
  }
})


function createSlug(title) {
  return title
    .replace(/\s+/g, '_')
    .replace(/\W/g, '')
    .toLowerCase()
}

Page.beforeValidate(page => {
  if(!page.slug) page.slug = createSlug(page.title)
})


Page.belongsTo(User, { as: 'author' })
User.hasMany(Page)

module.exports = { db , Page, User, createSlug }
