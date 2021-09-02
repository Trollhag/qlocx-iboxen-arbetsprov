const { Schema } = require('mongoose')

module.exports = new Schema({
  dimensions: {
    type: [Number, Number, Number],
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
}, { collection: `compartments` })