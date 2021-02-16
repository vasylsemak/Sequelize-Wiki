const Sequelize = require('sequelize')
const Op = Sequelize.Op
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
  },
  tags: {
    type: Sequelize.ARRAY(Sequelize.STRING)
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

// Service F-ns
function createSlug(title) {
  return title
    .replace(/\s+/g, '_')
    .replace(/\W/g, '')
    .toLowerCase()
}
function tagsToArray(str) {
  return str.replace(/\W/, '').split(/[\s]+/)
}

// Hooks
Page.beforeValidate(page => {
  if(!page.slug) page.slug = createSlug(page.title)
  if(page.tags && typeof page.tags === "string") {
    page.tags = tagsToArray(page.tags)
  }
})


// Class Methods
Page.findByTag = async function(tag) {
  const pages = await Page.findAll({
    where: {
      contant: { $contains: [tag] }
    }
  })
  return pages
}


Page.belongsTo(User, { as: 'author' })
User.hasMany(Page)

module.exports = { db , Page, User, createSlug }
