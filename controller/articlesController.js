const express = require('express')
const router = express.Router()
const session = require('express-session')
const slugify = require('slugify')
const Category = require('../database/models/Category')
const Article = require('../database/models/Article')
const adminAuth = require('../middleware/adminAuth')


//--------------------------------------------------------------------------------------

router.use(session({
    secret: 'secret',
    cookie: {maxAge: 1800000},
    resave: false,
    saveUninitialized: true
}))

// Rotas
// ---------------------------------------- GET ----------------------------------------

router.get('/admin/article/new', adminAuth, (req, res) => {

    Category.findAll().then((categories) => {
        res.render('admin/articles/new', {

            categories: categories
        })
    })
})

// READ ALL
router.get('/admin/articles', (req, res) => {

    Article.findAll({

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
router.get('/admin/article/edit/:id', adminAuth, (req,res) => {
    
    var id = req.params.id

    if (isNaN(id)) {
        res.redirect('/')

    } else {
        Article.findByPk(id).then(article => {

            if (article != undefined) {
                Category.findAll().then((categories) => {
                    res.render('admin/articles/edit', {

                        article: article,
                        categories: categories
                    })
                })
            } else {
                res.redirect('/')
            }
        }).catch((err) => {
            console.log('Error: ' + err)
            res.redirect('/')
        })
    }
})

// READ ONE BY SLUG 
router.get('/article/:id/:slug', (req, res) => {
    
    var id = req.params.id
    var slug = req.params.slug

    if (id != undefined) {
        Article.findOne({
    
            where: {slug: slug}
    
        }).then((article) => {
            Category.findAll().then((categories) => {
            
                if (article != undefined) {
                    res.render('article', {
    
                        article: article,
                        categories: categories
                    })
                }
                else {
                    res.redirect('/')
                }
            }).catch((err) => {
                res.redirect(err)
            })
        }).catch((err) => {
            res.redirect(err)
        })
    } else {
        res.redirect('/')
    }
})

// READ ONE BY SLUG INCLUDE TAG
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
        } else {
            res.redirect('/admin')
        }
    }).catch((err) => {
        res.redirect('/admin')
    })
})

router.get('/articles/page/:pageNum', (req, res) => {

    var pageNum = req.params.pageNum
    var offset = 0

    if (isNaN(pageNum) || pageNum == 1) {
        offset = 0
    } else {
        offset = (parseInt(pageNum) - 1) * 4
    }

    Article.findAndCountAll({

        limit: 4,
        offset: offset,
        order: [['id', 'DESC']]

    }).then((articles) => {

        var next

        if (offset + 4 >= articles.count) {
            next = false
        } else {
            next = true
        }

        var result = {
            pageNum: parseInt(pageNum),
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
router.post('/article/create', adminAuth, (req, res) => {

    var title = req.body.title
    var description = req.body.description
    var categoryId = req.body.categoryId

    if (isNaN(categoryId)) {
        console.log(categoryId + ' is not a number')
        res.redirect('/admin')

    } else {
        Article.create({
            
            title: title,
            slug: slugify(title),
            description: description,
            categoryId: categoryId
    
        }).then(() => {
            console.log('Article ' + title + ' created')
            res.redirect('/admin/articles/')

        }).catch((err) => {
            console.log('Error: ' + err)
            res.redirect('/')
        })
    }
})

// UPDATE
router.post('/article/update', adminAuth, (req, res) => {
    
    var id = req.body.id
    var title = req.body.title
    var description = req.body.description
    var categoryId = req.body.categoryId

    if (isNaN(categoryId)) {
        console.log(categoryId + ' is not a number')
        res.redirect('/')

    } else {
        Article.update({

            title: title,
            slug: slugify(title),
            description: description,
            categoryId: categoryId
    
        }, {

            where: {id: id}

        }).then(() => {
            console.log('Article ' + id + ' updated')
            res.redirect('/admin/articles/')

        }).catch((err) => {
            console.log('Error: ' + err)
            res.redirect('/')
        })
    }
})

// DELETE
router.post('/article/delete', adminAuth, (req, res) => {

    var id = req.body.id

    if (id != undefined) {

        if (isNaN(id)) {
            console.log(id + ' is not a number')
            res.redirect('/')

        } else {
            Article.destroy({

                where: {id: id}

            }).then(() => {
                console.log('Article ' + id + ' deleted')
                res.redirect('/admin/articles/')

            }).catch((err) => {
                console.log('Error: ' + err)
                res.redirect('/')
            })
        }
    } else {
        console.log(id + ' is not defined')
        res.redirect('/')
    }
})

//-------------------------------------------------------------------------------------------

module.exports = router