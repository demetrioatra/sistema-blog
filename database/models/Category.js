const sequelize = require('sequelize')
const connection = require('../connection')

const Category = connection.define('category', {
    title: {
        type: sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: sequelize.STRING,
        allowNull: false
    }
})

Category.sync({force: false})

module.exports = Category