const sequelize = require('sequelize')
const connection = new sequelize('sistema-blog', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    timezone: "-03:00"
})

module.exports = connection