const { Schema } = require('mongoose')

module.exports = new Schema({
  coordinates: {
    type: [Number, Number],
    required: true,
  },
  compartments: [{
    type: Schema.Types.ObjectId,
    ref: 'Compartment',
    required: true,
  }],
}, { collection: `lockers` })