const jwt = require('jsonwebtoken')
const Transporter = require('../models/transporter')
const Router = require('@koa/router')

const TransporterRouter = new Router({
  prefix: `/transporter`
})
.post(`/:id/token`, async ctx => {
  try {
    const transporter = await Transporter.findById(ctx.params.id)
    const token = transporter.token(ctx.request.body.secret)
    if (token) {
      ctx.body = token
    } else {
      throw ''
    }
  } catch(e) {
    ctx.throw(403, 'Invalid details.')
  }
})

module.exports = TransporterRouter