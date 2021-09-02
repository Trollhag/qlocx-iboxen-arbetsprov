const { model } = require('mongoose')
const compartmentSchema = require('../schemas/compartment')

const Compartment = model(`Compartment`, compartmentSchema)

Compartment.statusList = {
  EMPTY: 'empty',
  OCCUPIED: 'occupied',
  BROKEN: 'broken',
}

module.exports = class extends Compartment {
  static create({ dimensions, status }) {
    dimensions.sort()
    return super.create({ dimensions, status })
  }
}