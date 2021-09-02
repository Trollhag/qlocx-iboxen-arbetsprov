const { model } = require('mongoose')
const lockerSchema = require('../schemas/locker')
const Compartment = require('./compartment')

const Locker = model(`Locker`, lockerSchema)

module.exports = class extends Locker {
  static create({ coordinates, compartments }) {
    return super.create({ coordinates, compartments })
  }
  async delete() {
    await Promise.all(this.compartments.map(_id => new Compartment({ _id }).delete()))
    return await super.delete()
  }
}