require('./db')
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const authenticate = require('./middlewares/authenticate')
const router = require('./router')

const app = new Koa()

app.use(bodyParser())
app.use(authenticate())
app.use(router.routes())
app.use(router.allowedMethods())

module.exports = app