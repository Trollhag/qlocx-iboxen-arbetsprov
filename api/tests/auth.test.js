const fs = require('fs')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const request = require('supertest')
const app = require('../server').callback()
const Transporter = require('../models/transporter')
const Package = require('../models/package')

let transporter, packet;

beforeAll(async () => {
  transporter = await Transporter.create({
    name: 'Test',
    auth: bcrypt.hashSync('password', 10),
  })
  packet = await Package.create({ transporter: transporter._id, dimensions: [1,1,1], coordinates: [0,0], address: 'Some street'   })
})

afterAll(async () => {
  await transporter.delete()
  await packet.delete()
  await mongoose.connection.close()
})

describe('Authentication tests', () => {
  it('should deny package creation', async () => {
    const res = await request(app)
      .post('/api/packages/')
      .send({
        address: 'Faker Drive 123',
        coordinates: [1.1, 1.1],
        dimensions: [200, 75, 5]
      })
    expect(res.statusCode).toEqual(401)
  })
  it('should return valid token', async () => {
    const res = await request(app)
      .post(`/api/transporter/${transporter._id}/token/`)
      .send({
        secret: 'password',
      })
    expect(typeof res.text).toEqual('string')
    expect(jwt.verify(res.text, fs.readFileSync(`./api/.keys/${transporter._id}.pem`), { algorithm: 'RS256', issuer: 'qlocx+iboxen', audience: 'transporter' }) instanceof Error).toBe(false)
  })
  it('should accept valid token', async () => {
    const authRes = await request(app)
      .post(`/api/transporter/${transporter._id}/token/`)
      .send({
        secret: 'password',
      })
    const res = await request(app)
      .get(`/api/packages/${packet._id}/`)
      .set('Authorization', `Bearer ${authRes.text}`)
      .send()
    expect(typeof res.body._id).toBe('string')
  })
})