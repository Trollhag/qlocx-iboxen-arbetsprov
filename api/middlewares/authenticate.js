const fs = require('fs')
const jwt = require('jsonwebtoken')

const Authenticate = () => async (ctx, next) => {
  if (ctx.headers.authorization) {
    const token = ctx.headers.authorization.replace('Bearer ', ''),
          decoded = jwt.decode(token)
    if (decoded.transporter) {
      const publicKey = fs.readFileSync(`./api/.keys/${decoded.transporter}.pem`)
      try {
        ctx.authed = Authenticate._authed = jwt.verify(token, publicKey, { algorithm: 'RS256', issuer: 'qlocx+iboxen' })
      } catch(error) {
        ctx.authed = Authenticate._authed = error
      }
    }
  }
  await next()
}

Authenticate.verify = props => {
  return Authenticate._authed && ! (Authenticate._authed instanceof Error) && Object.keys(props).filter(prop => props[prop] !== Authenticate._authed[prop]).length > 0
}

module.exports = Authenticate