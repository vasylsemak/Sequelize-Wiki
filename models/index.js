const Sequelize = require('sequelize')
const db = new Sequelize('postgres://localhost:5432/wikistack', {
  logging: false
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
      unique: true,
      isEmail: true
    }
  }
})

function createSlug(title) {
  return title.replace(/\s+/g, '_').replace(/\W/g, '')
}

Page.beforeValidate(page => {
  if(!page.slug) page.slug = createSlug(page.title)
})


module.exports = { db , Page, User }
