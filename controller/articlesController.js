const express = require('express')
const router = express.Router()

//-------------------------------------------------------------------------------------------
// Rotas
// Get
router.get('/admin/article/new', (req, res) => {
    res.render('admin/articles/new')
})

// READ ALL
router.get('/admin/articles', (req, res) => {
    res.render('admin/articles/index')
})

module.exports = router