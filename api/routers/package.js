const Router = require('@koa/router')
const Package = require('../models/package')
const Authenticate = require('../middlewares/authenticate')

const PackageRouter = new Router({
  prefix: `/packages`
})
.post(`/`, async ctx => {
  if (Authenticate.verify({ aud: 'transporter' })) {
    try {
      ctx.body = await Package.create({ ...ctx.request.body, transporter: ctx.authed.transporter })
      ctx.response.status = 201
    } catch(error) {
      ctx.throw(500)
    }
  } else {
    ctx.throw(401)
  }
})
.get(`/:id`, async ctx => {
  let packet;
  try {
    packet = await Package.findById(ctx.params.id).lean()
  } catch(error) {
    ctx.throw(404)
  }
  if (Authenticate.verify({ audience: 'transporter', transporter: packet.transporter.toString() })) {
    ctx.body = packet
  } else {
    ctx.throw(401)
  }
})
.patch(`/:id`, async ctx => {
  let packet;
  try {
    packet = await Package.findById(ctx.params.id)
  } catch(error) {
    ctx.throw(404)
  }
  if (Authenticate.verify({ audience: 'transporter', transporter: packet.transporter })) {
    try {
      ctx.body = await Package.update({ _id: ctx.params.id, ...ctx.request.body })
    } catch(error) {
      ctx.throw(500)
    }
  } else {
    ctx.throw(401)
  }
})
.delete(`/:id`, async ctx => {
  let packet;
  try {
    packet = await Package.get(ctx.params.id)
  } catch(error) {
    ctx.throw(404)
  }
  if (Authenticate.verify({ audience: 'transporter', transporter: packet.transporter })) {
    try {
      await Package.delete(ctx.params.id)
      ctx.response.status = 200
    } catch(error) {
      ctx.throw(500)
    }
  } else {
    ctx.throw(401)
  }
})

module.exports = PackageRouter