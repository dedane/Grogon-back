const express = require('express');
const app = express();

const morgan = require('morgan');
const bodyparser = require('body-parser');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors')

const driverRoute = require('./routes/driver')
const mechanicRoute = require('./routes/mechanic')
/* require('dotenv').config(); */

mongoose.Promise = require('bluebird')
mongoose.connect("mongodb+srv://grogon: grogon123 @cluster0.7wbz0.mongodb.net/GROGON?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
/* mongoose.set('UseCreateIndex',true) */

const conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error:'))
conn.once('open',() => {
    console.log('connected to a database')
})

app.use(morgan('dev'))
app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json())
app.use(cors())

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-requested-with, Content-Type, Accept, Authorization"
    )
    if (req.method === 'Options'){
        res.header("Access-control-Allow-Methods", 'PUT','POST', 'PATCH', 'DELETE', 'GET')
        return res.status(200).json({

        })
    }
    next()
})

app.use('/driver', driverRoute)
app.use('/mechanic', mechanicRoute)

app.use((req,res,next) =>{
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req,res,next) => {
    res.status(err.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;