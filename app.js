const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const session = require('express-session')
const router = require('./includes/routes/route')
const {sessionStore} = require('./includes/connection/connect')

const app = express()

app.set('views', path.join(__dirname, './views'))
app.set('view engine', 'ejs')

app.use(session({
    secret: 'darkestSecret!#',
    resave: true,
    store: sessionStore,
    saveUninitialized: true,
    cookie: {
        maxAge: null
    }
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', router)

app.listen(3001, () => {
    console.log("Server started")
})