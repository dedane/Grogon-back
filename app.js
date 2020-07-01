const express = require('express');
const app = express();

const morgan = require('morgan');
const bodyparser = require('body-parser');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors')

const DriverRoute = require('./routes/driver')
const MechanicRoute = require('./routes/mechanic')
require('dotenv').config();

mongoose.Promise = require('bluebird')
mongoose.connect('mongodb+srv://grogon:' + process.env.MONGO_ATLAS_PW + '@cluster0.7wbz0.mongodb.net/GROGON?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.set('UseCreateIndex',true)

const conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error:'))
conn.once('open',() => {
    console.log('connected to a database')
})