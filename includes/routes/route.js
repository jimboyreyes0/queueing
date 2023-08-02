const express = require('express')
const multer = require('multer')
const { getMainPageRender, getViewPageRender, finishCurrentQueue, registerAccount, loginAccount } = require('../controllers/main')

const router = express.Router()
const upload = multer()

router.get('/', (req, res) => {
    if (req.session && req.session.user && req.session.user.isLoggedIn === true) {
        return res.redirect('/home');
      }
    res.render('login')
})
router.get('/register', (req, res) => {
    if (req.session && req.session.user && req.session.user.isLoggedIn === true) {
        return res.redirect('/home');
      }
    res.render('register')
})
router.get('/home', getMainPageRender)
router.get('/view', getViewPageRender)

router.get('/logout', (req, res) => { 
    if(req.session) {
      req.session.destroy((err) => {
        if(err) {
          throw err;
        }
        res.redirect('/')
      })
    }
})

router.post('/finishCurrentQueue', upload.none(), finishCurrentQueue)
router.post('/registerAccount', upload.none(), registerAccount)
router.post('/loginAccount', upload.none(), loginAccount)


router.get('*', (req, res) => {res.status(404).send('Page not found.')})

module.exports = router;