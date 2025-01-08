const express = require('express')
const router = express.Router()
const Category = require('../database/models/Category')
const Article = require('../database/models/Article')
const slugify = require('slugify')

//-------------------------------------------------------------------------------------------
// Rotas
// GET
router.get('/admin/article/new', (req, res) => {

    Category.findAll().then((categories) => {
        res.render('admin/articles/new', {
            categories: categories
        })
    })
})

// READ ALL
router.get('/admin/articles', (req, res) => {

    Article.findAll({
        include: [{model: Category}]
    }).then((articles) => {
        res.render('admin/articles/index', {
            articles: articles
        })
    })
})

// READ ONE
router.get('/admin/article/edit/:id', (req,res) => {
    
    var id = req.params.id

    if(isNaN(id)) 
        res.redirect('/admin/articles/')
    else {
        Article.findByPk(id).then(article => {
            if (article != undefined) {
                res.render('admin/articles/edit', {
                    article: article
                })
            } else
                res.redirect('/admin/articles/')
        })
    }
})

// POST
// CREATE
router.post('/article/create', (req, res) => {

    var title = req.body.title
    var description = req.body.description
    var categoryId = req.body.category

    Article.create({
        title: title,
        slug: slugify(title),
        description: description,
        categoryId: categoryId
    }).then(() => {
        res.redirect('/admin/articles/')
    })
})

// UPDATE


// DELETE
router.post('/article/delete', (req, res) => {

    var id = req.body.id

    if (id != undefined) {
        if (!isNaN(id)) {
            Article.destroy({
                where: {id: id}
            }).then(() => {
                res.redirect('/admin/articles/')
            })
        } else
            res.redirect('/admin/articles/')
    } else
    res.redirect('/admin/articles/')
})

//-------------------------------------------------------------------------------------------

module.exports = router