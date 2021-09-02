const { Schema } = require('mongoose')

module.exports = new Schema({
  transporter: {
    type: Schema.Types.ObjectId,
    ref: 'Transporter',
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  coordinates: {
    type: [Number, Number],
    required: true,
  },
  dimensions: {
    type: [Number, Number, Number],
    required: true,
  },
  compartment: {
    type: Schema.Types.ObjectId,
    ref: 'Compartment',
    required: true,
  }
}, { collection: `packages` })