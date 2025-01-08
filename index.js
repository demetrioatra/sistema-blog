const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/connection')
const categoriesController = require('./controller/categoriesController')
const articlesController = require('./controller/articlesController')
var path = require('path');
const Category = require('./database/models/Category')
const Article = require('./database/models/Article')

//------------------------------------------------------------------------

// Conexão com o banco
connection.authenticate().then(() => {
    console.log('Conectado com o banco!')
}).catch((err) => {
    console.log('Conexão inválida! ERRO: ' + err)
})

app.use(express.static('public'))
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.use('/', categoriesController)
app.use('/', articlesController)


// Rotas
// GET
app.get('/', (req, res) => {

    Article.findAll().then((articles) => {
        res.render('index', {
            articles: articles
        })
    })
})

app.get('/:slug', (req, res) => {

    var slug = req.params.slug

    Article.findOne({
        where: {slug: slug}
    }).then((article) => {
        if (article != undefined) {
            res.render('article', {
                article: article
            })
        }
        else {
            res.redirect('/')
        }
    }).catch((err) => {
        res.redirect('/')
    })
})

//------------------------------------------------------------------------

app.listen(8081, () => {
    console.log('Servidor iniciado!')
})