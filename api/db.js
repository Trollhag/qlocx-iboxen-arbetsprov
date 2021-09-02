require('dotenv').config()
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true })

// Make sure all models are always loaded.
require('./models/transporter')
require('./models/package')
require('./models/locker')
require('./models/compartment')