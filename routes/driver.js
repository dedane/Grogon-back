const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const multer = require('multer')
const jwt =require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Driver = require('../models/driver');
const cloudinary = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: "dkq3tnpwu",
    api_key: "324383398255366",
    api_secret: "A6oe7AfxJejaSZEwdlt8wtK875E"
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    folder: "Profiles",
    allowedFormats: ["jpg","png"],
    transformation: [{ width: 500, height: 500, crop: "limit"}]
});

const parser = multer({ storage: storage })
/* const storage = multer.diskStorage({
    destination: function(req, file, cb){
      cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
      cb(null, new Date().toISOString() + file.originalname);
    }
  });
  const upload = multer({storage: storage });
 */


router.post('/register', parser.single('VehicleImage'), (req,res,next) => {
    Driver.find({ Email: req.body.Email })
    .exec()
    .then(driver => {
        if (driver.length >= 1){
            return res.status(409).json({
                message: 'You already registered Driver'
            })
        }
        else {
            bcrypt.hash(req.body.Password, 10, (err,hash) => {
                if (err){
                    return res.status(500).json({
                        error:err
                    })
                }
                else{
                    const driver = new Driver({
                        _id: new mongoose.Types.ObjectId(),
                        Email: req.body.Email,
                        Password: hash,
                        Name: req.body.Name,
                        Phonenumber: req.body.Phonenumber,
                        Carmake: req.body.Carmake,
                        PurchaseDate: req.body.PurchaseDate,
                        /* const VehicleImage = {}, */
                        /* VehicleImage._id = req.file.VehicleImage_id, */
                        VehicleImage: req.file.url
                    })
                driver.save()
                .then(result => {
                    console.log(result)
                    res.status(201).json({
                        message: 'successfully Registered'
                    })
                })
                .catch(error => {
                    console.log(error)
                    res.status(500).json({
                        error: err
                    })
                })
                }
            })
        }
    })

})

router.post('/login', (req,res,next) => {
    Driver.find({ Email: req.body.Email })
        .exec()
        .then(driver => {
            if (driver.length < 1){
                return res.status(401).json({
                    message: 'Auth Failed'
                })
            }
            bcrypt.compare(req.body.Password, driver[0].Password, (err,result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth Failed'
                    })
                }
                if (result){
                    const token = jwt.sign({
                        Email: driver[0].Email,
                        _id: driver[0]._id
                    }, process.env.JWT_KEY,
                    {
                        expiresIn: '24h'
                    }
                  )
                  return res.status(200).json({
                      message: 'Auth successful',
                      token: token,
                      Email: driver[0].Email,
                      _id: driver[0]._id
                  })
                }
                res.status(401).json({
                    message: 'Auth failed'
                })
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

router.get('/driverslocation', function(req,res,next){
    Driver.geoNear(
        {type: 'Point',
        coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)]},
        {maxDistance: 100000,
        spherical: true}
    ).then(function(driver){
        res.send(driver)
    })

})

router.get('/', (req,res,next) => {
    Driver.find({})
    .exec()
    .then(doc => {
        console.log(err)
        res.status(500).json({ error: err })
    })
})

router.get('./:driverId', (req,res,next) => {
    const id = req.params.driverId
    Driver.find({ driverId: id })
    .exec()
    .then( doc => {
        console.log(doc)
        res.status(500).json(doc)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ error: err })
    })
})

router.delete('./:driverId', (req,res,next) => {
    Driver.remove({
        _id: req.params.driverId
    })
    .exec()
    .then( result => {
        res.status(200).json({
            message: 'Driver Deleted',
            request: {
                type: 'POST',
                url: 'https://localhost:3000/Drivers',
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})
module.exports = router;