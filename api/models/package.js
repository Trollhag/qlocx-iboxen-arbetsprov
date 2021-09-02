const { model } = require('mongoose')
const packageSchema = require('../schemas/package')
const Locker = require('./locker')
const Compartment = require('./compartment')

const Package = model(`Package`, packageSchema)

module.exports = class extends Package {
  static async create({ transporter, address, coordinates, dimensions }) {
    dimensions.sort()
    const lockers = await Locker.aggregate([
      { $lookup: { from: 'compartments', localField: 'compartments', foreignField: '_id', as: 'compartments' } },
      { $match: { 'compartments.status': Compartment.statusList.EMPTY } },
    ])
    lockers.sort((a,b) => Math.abs(coordinates[0] - a.coordinates[0] + coordinates[1] - a.coordinates[1]) - Math.abs(coordinates[0] - b.coordinates[0] + coordinates[1] - b.coordinates[1]))
    let locker, l = 0, compartment;
    while (compartment === undefined) {
      locker = lockers[l]
      const compartments = locker.compartments.filter(({ status }) => status === Compartment.statusList.EMPTY)
        .sort((a,b) => a.dimensions[0] * a.dimensions[1] * a.dimensions[2] - b.dimensions[0] * b.dimensions[1] * b.dimensions[2])
      const c = compartments.find((comp) => dimensions[0] < comp.dimensions[0] && dimensions[1] < comp.dimensions[1] && dimensions[2] < comp.dimensions[2])
      if (c) {
        compartment = c
      } else if (l < lockers.length) {
        l++
      } else {
        throw new Error('No locker found.')
      }
    }
    console.log(locker.coordinates)
    await Compartment.updateOne({ _id: compartment._id }, { status: Compartment.statusList.OCCUPIED })
    return await super.create({ transporter, address, coordinates, dimensions, compartment: compartment._id })
  }
}