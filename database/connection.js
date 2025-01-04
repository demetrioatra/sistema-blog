const sequelize = require('sequelize')
const connection = new sequelize('sistema-blog', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
})

module.exports = connection