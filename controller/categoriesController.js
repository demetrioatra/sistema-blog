const express = require('express')
const router = express.Router()
const session = require('express-session')
const slugify = require('slugify')
const Category = require('../database/models/Category')
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

router.get('/admin/category/new', adminAuth, (req, res) => {

    Category.findAll().then((categories) => {
        res.render('admin/categories/new', {

            categories: categories
        })
    })
})

// READ ALL
router.get('/admin/categories', (req, res) => {

    Category.findAll().then((categories) => {
        res.render('admin/categories/index', {

            categories: categories
        })
    })
})

// READ ONE
router.get('/admin/category/edit/:id', adminAuth, (req,res) => {
    
    var id = req.params.id

    if (isNaN(id)) {
        res.redirect('/')

    } else {
        Category.findByPk(id).then(category => {
            
            if (category != undefined) {
                Category.findAll().then((categories) => {
                    res.render('admin/categories/edit', {

                        category: category,
                        categories: categories
                    })
                })
            } else {
                res.redirect('/')
            }
        })
    }
})

// ---------------------------------------- POST ----------------------------------------
// CREATE
router.post('/category/create', adminAuth, (req, res) => {

    var title = req.body.title

    if (title != undefined) {
        Category.create({

            title: title,
            slug: slugify(title)

        }).then(() => {
            console.log('Category ' + title + ' created')
            res.redirect('/admin/categories/')

        }).catch((err) => {
            console.log('Error: ' + err)
            res.redirect('/')
        })
    } else {
        console.log(title + ' is not defined')
        res.render('/')
    }
})

// UPDATE
router.post('/category/update', adminAuth, (req, res) => {

    var id = req.body.id
    var title = req.body.title

    Category.update({

        title: title,
        slug: slugify(title)

    }, {

        where: {id: id}

    }).then(() => {
        console.log('Category ' + id + ' updated')
        res.redirect('/admin/categories/')

    }).catch((err) => {
        console.log('Error: ' + err)
        res.redirect('/')
    })
})

// DELETE
router.post('/category/delete', adminAuth, (req, res) => {
    
    var id = req.body.id

    if (id != undefined) {
        
        if (isNaN(id)) {
            console.log(id + ' is not a number')
            res.redirect('/')  

        } else {
            Category.destroy({

                where: {id: id}

            }).then(() => {
                console.log('Category ' + id + ' deleted')
                res.redirect('/admin/categories/')

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