const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path');
const bcrypt = require('bcryptjs')
const connection = require('./database/connection')
const Category = require('./database/models/Category')
const User = require('./database/models/User')
const Article = require('./database/models/Article')
const categoriesController = require('./controller/categoriesController')
const articlesController = require('./controller/articlesController')
const usersController = require('./controller/usersController')

//------------------------------------------------------------------------

app.use(express.static('public'))
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.use('/', categoriesController)
app.use('/', articlesController)
app.use('/', usersController)

// Rotas
// ------------------------------- GET -------------------------------

app.get('/404', (req, res) => {

    Category.findAll().then((categories) => {
        res.render('notfound', {

            categories: categories
        })
    })
})

app.get('/about', (req, res) => {

    Category.findAll().then((categories) => {
        res.render('about', {

            categories: categories
        })
    })
})

app.get('/', (req, res) => {

    Article.findAll({
        
        limit: 4,
        order: [['id', 'DESC']]

    }).then((articles) => {
        Category.findAll().then((categories) => {
            res.render('index', {

                articles: articles,
                categories: categories
            })
        })
    })
})

//------------------------------------------------------------------------

// Servidor
app.listen(8081, () => {    console.log('Servidor iniciado!')   })

// Conexão com o banco
connection.authenticate().then(() => {
    console.log('Conectado com o banco!')
}).catch((err) => {
    console.log('Conexão inválida! ERRO: ' + err)
})