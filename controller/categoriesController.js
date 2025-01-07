const express = require('express')
const router = express.Router()
const Category = require('../database/models/Category')
const slugify = require('slugify')
const { where } = require('sequelize')

//-------------------------------------------------------------------------------------------
// Rotas
// GET
router.get('/admin/category/new', (req, res) => {

    res.render('admin/categories/new')
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
router.get('/admin/category/edit/:id', (req,res) => {
    
    var id = req.params.id

    if(isNaN(id)) 
        res.redirect('/admin/categories/')
    else {
        Category.findByPk(id).then(category => {
            if (category != undefined) {
                res.render('admin/categories/edit', {
                    category: category
                })
            } else
                res.redirect('/admin/categories/')
        })
    }
})

// POST
// CREATE
router.post('/category/create', (req, res) => {

    var title = req.body.title

    if (title != undefined) {
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect('/admin/categories/')
        })
    } else
        res.render('admin/categories/new')
})

// UPDATE
router.post('/category/update', (req, res) => {

    var id = req.body.id
    var title = req.body.title

    Category.update({
        title: title,
        slug: slugify(title)
    }, {
        where: {id: id}
    }).then(() => {
        res.redirect('/admin/categories/')
    })
})

// DELETE
router.post('/category/delete', (req, res) => {
    
    var id = req.body.id

    if (id != undefined) {
        if (!isNaN(id)) {
            Category.destroy({
                where: {id: id}
            }).then(() => {
                res.redirect('/admin/categories/')
            })
        } else
        res.redirect('/admin/categories/')  
    } else
        res.redirect('/admin/categories/')
})

//-------------------------------------------------------------------------------------------

module.exports = router