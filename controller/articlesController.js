const express = require('express')
const router = express.Router()
const Category = require('../database/models/Category')
const Article = require('../database/models/Article')
const slugify = require('slugify')

// Rotas
// ---------------------------------------- GET ----------------------------------------
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

        limit: 4,
        include: [{model: Category}],
        order: [['id', 'DESC']]

    }).then((articles) => {
        Category.findAll().then((categories) => {

            res.render('admin/articles/index', {

                articles: articles,
                categories: categories
            })
        })
    })
})

// READ ONE
router.get('/admin/article/edit/:id', (req,res) => {
    
    var id = req.params.id

    if (isNaN(id)) 
        res.redirect('/admin')
    
    else {
        Article.findByPk(id).then(article => {

            if (article != undefined) {
                Category.findAll().then((categories) => {
                    res.render('admin/articles/edit', {

                        article: article,
                        categories: categories
                    })
                })
            } else
                res.redirect('/admin')
        }).catch((err) => {
            res.redirect('/admin')
        })
    }
})

// READ ONE BY TAG
router.get('/articles/tagged/:slug', (req, res) => {

    var slug = req.params.slug

    Category.findOne({

        where: {slug: slug},
        include: [{model: Article}]

    }).then((category) => {
        if (category != undefined) {
            Category.findAll().then((categories) => {
                res.render('index', {
                    
                    articles: category.articles,
                    categories: categories
                })
            })
        } else
            res.redirect('/admin')
    }).catch((err) => {
        res.redirect('/admin')
    })
})

router.get('/articles/page/:num', (req, res) => {

    var pageNum = req.params.num
    var offset = 0

    if (isNaN(pageNum) || offset == 1)
        offset = 0
    else
        offset = parseInt(pageNum) * 4

    Article.findAndCountAll({

        limit: 4,
        offset: offset,
        order: [['id', 'DESC']]

    }).then((articles) => {

        var next

        if (offset + 4 >= articles.count)
            next = false
        else
            next = true

        var result = {
            pageNum: pageNum,
            next: next,
            articles: articles
        }
        
        Category.findAll().then((categories) => {
            res.render('admin/articles/page', {
                
                result: result,
                categories: categories,
            })
        })
    })
})

// ---------------------------------------- POST ----------------------------------------
// CREATE
router.post('/article/create', (req, res) => {

    var title = req.body.title
    var description = req.body.description
    var categoryId = req.body.categoryId

    if (isNaN(categoryId)) {
        
        console.log('Categoria ' + categoryId + ' não é um número')
        res.redirect('/admin')

    } else {
        Article.create({
            
            title: title,
            slug: slugify(title),
            description: description,
            categoryId: categoryId
    
        }).then(() => {
            res.redirect('/admin/articles/')
        }).catch((err) => {
            res.redirect('/admin')
        })
    }
})

// UPDATE
router.post('/article/update', (req, res) => {
    
    var id = req.body.id
    var title = req.body.title
    var description = req.body.description
    var categoryId = req.body.categoryId

    if (isNaN(categoryId)) {

        console.log('Categoria ' + categoryId + ' não é um número')
        res.redirect('/admin')

    } else {
        Article.update({

            title: title,
            slug: slugify(title),
            description: description,
            categoryId: categoryId
    
        }, {

            where: {id: id}

        }).then(() => {
            res.redirect('/admin/articles/')
        }).catch((err) => {
            res.redirect('/admin')
        })
    }
})

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
            res.redirect('/admin')
    } else
        res.redirect('/admin')
})

//-------------------------------------------------------------------------------------------

module.exports = router