const { model } = require('mongoose')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const transporterSchema = require('../schemas/transporter')

const Transporter = model(`Transporter`, transporterSchema)

module.exports = class extends Transporter {
  constructor(data) {
    super(data)
    return this;
  }
  token(secret) {
    const authed = bcrypt.compareSync(secret, this.auth)
    if (authed) {
      return jwt.sign({ transporter: this._id.toString() }, fs.readFileSync(`./api/.keys/${this._id}.key`), { algorithm: 'RS256', issuer: 'qlocx+iboxen', audience: 'transporter', expiresIn: '5min' })
    }
  }
  static async create(data) {
    const transporter = await super.create(data)

    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    try {
      fs.mkdirSync(`./api/.keys/`);
    } catch(e) {
      /* Fail silently if dir exists. */
    }
    fs.writeFileSync(`./api/.keys/${transporter._id}.pem`, publicKey)
    fs.writeFileSync(`./api/.keys/${transporter._id}.key`, privateKey)

    return transporter
  }
  delete() {
    fs.unlinkSync(`./api/.keys/${this._id}.pem`)
    fs.unlinkSync(`./api/.keys/${this._id}.key`)
    return super.delete()
  }
}