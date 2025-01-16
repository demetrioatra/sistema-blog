const express = require('express')
const router = express()
const session = require('express-session')
const bcrypt = require('bcryptjs')
const User = require('../database/models/User')
const Category = require('../database/models/Category')
const adminAuth = require('../middleware/adminAuth')

//--------------------------------------------------------------------------------------

router.use(session({
    secret: 'secret',
    cookie: {maxAge:  1800000}, // (qtd em min * 60) + 000 no final
    resave: false,
    saveUninitialized: true
}))

// Rotas
// ---------------------------------------- GET ----------------------------------------

router.get('/user/signup', (req, res) => {

    Category.findAll().then((categories) => {
        res.render('admin/users/new', {

            categories: categories
        })
    })
})

// READ ALL
router.get('/admin/users', (req, res) => {

    User.findAll({

        order: [['id', 'DESC']]

    }).then((users) => {
        Category.findAll().then((categories) => {
            res.render('admin/users/index', {
    
                users: users,
                categories: categories
            })
        })
    })
})

// READ ONE
router.get('/admin/user/edit/:id', adminAuth, (req, res) => {

    var id = req.params.id
    
    if (isNaN(id)) {
        res.redirect('/')

    } else {
        User.findByPk(id).then(user => {

            if (user != undefined) {
                Category.findAll().then((categories) => {
                    res.render('admin/users/edit', {
            
                        user: user,
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

router.get('/user/login', (req, res) => {

    Category.findAll().then((categories) => {
        res.render('admin/users/login', {

            categories: categories
        })
    })
})

router.get('/user/logout', (req, res) => {
    
    req.session.user = undefined

    res.redirect('/')
})

// ---------------------------------------- POST ----------------------------------------

// CREATE
router.post('/user/create', (req, res) => {
    
    var { name, email, password }= req.body
    var salt = bcrypt.genSaltSync(10)
    var hash = bcrypt.hashSync(password, salt)

    if (email != undefined && name != undefined) {        
        User.findOne( {

            where: {email: email}

        }).then((user) => {
            
            if (user == undefined) {
                User.create({
            
                    name: name,
                    email: email,
                    password: hash
        
                }).then(() => {
                    console.log('User ' + name + ' created')
                    res.redirect('/admin/users/')
                    
                }).catch((err) => {
                    console.log('Error: ' + err)
                    res.redirect('/')
                })
            } else {
                console.log('User ' + email + ' is already defined')
                res.redirect('/')
            }
        })
    } else {
        console.log(email + ' is not defined')
        res.render('/')
    }
})

// UPDATE
router.post('/user/update', adminAuth, (req, res) => {

    var id = req.body.id
    var email = req.body.email
    var password = req.body.password

    User.update({

        email: email,
        password: password
    
    }, {
    
        where: {id: id}
    
    }).then(() => {
        console.log('User ' + id + ' updated')
        res.redirect('/admin/users/')

    }).catch((err) => {
        console.log('Error: ' + err)
        res.redirect('/')
    })
})

// DELETE
router.post('/user/delete', adminAuth, (req, res) => {

    var id = req.body.id

    if (id != undefined) {

        if (isNaN(id)) {
            console.log(id + ' is not a number')
            res.redirect('/')    

        } else {
            User.destroy({
                
                where: {id: id}

            }).then(() => {
                console.log('User ' + id + ' deleted')
                res.redirect('/admin/users/')

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

router.post('/user/login', (req, res) => {

    var { email, password } = req.body

    User.findOne({

        where: {email: email}
    
    }).then(user => {
        
        if (user != undefined) {

            var correctPassword = bcrypt.compareSync(password, user.password)

            if (correctPassword) {

                req.session.user = {

                    id: user.id, 
                    email
                }

                console.log('User ' + email + ' logged in')
                res.redirect('/')
            } else {
                console.log('Invalid Password')
                res.redirect('/user/login')
            }
        } else {
            console.log('User is not defined')
            res.redirect('/user/login')
        }
    }).catch((err) => {
        console.log(err)
        res.redirect('/user/login')
    })
})

//-------------------------------------------------------------------------------------------

module.exports = router