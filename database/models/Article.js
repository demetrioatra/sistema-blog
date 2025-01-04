const sequelize = require('sequelize')
const connection = require('../connection')
const Category = require('./Category')

const Article = connection.define('article', {
    title: {
        type: sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: sequelize.STRING,
        allowNull: false
    },
    description: {
        type: sequelize.TEXT,
        allowNull: false
    }
})

// Relacionamento 1-n
Category.hasMany(Article)
// Relacionamento 1-1
Article.belongsTo(Category)

Article.sync({force: false})

module.exports = Article