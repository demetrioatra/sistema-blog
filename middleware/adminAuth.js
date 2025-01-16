
function adminAuth (req, res, next) {
    
    if (req.session.user != undefined) {
        next()

    } else {
        console.log('Invalid Session')
        res.redirect('/user/login')
    }
}

module.exports = adminAuth