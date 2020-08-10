const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const multer = require('multer')
const jwt =require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Driver = require('../models/driver');
const cloudinary = require('cloudinary');
/* const { CloudinaryStorage } = require('multer-storage-cloudinary'); */

cloudinary.config({
    cloud_name: "dkq3tnpwu",
    api_key: "324383398255366",
    api_secret: "A6oe7AfxJejaSZEwdlt8wtK875E"
})

var storage = multer.diskStorage({
    filename: function(req, file, callback) {
      callback(null, Date.now() + file.originalname);
    }
  });
  var imageFilter = function (req, file, cb) {
      // accept image files only
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
          return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
  };
var upload = multer({ storage: storage, fileFilter: imageFilter})


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


router.post('/register',upload.single('VehicleImage'),(req,res) => {
    Driver.find({ Email: req.body.Email })
    .exec()
    .then(driver => {
        if (driver.length >= 1){
            return res.status(409).json({
                message: 'You already registered Driver'
            })
        }
        else {
            bcrypt.hash(req.body.Password, 10,(err,hash) => {
                /* const result = await cloudinary.v2.uploader.upload(req.file.path) */      
                if (err){
                    return res.status(500).json({
                        error:err
                    })
                }
                else{
                    /* cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
                        if(err) {
                          req.flash('error', err.message);
                          return res.redirect('back');
                        } */
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
                        
                        /* VehicleImage: result.secure_url */
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

router.patch('/register/:Id',upload.single('VehicleImage'), async(req,res) => {
    const result = await cloudinary.v2.uploader.upload(req.file.path)
    const id = req.params.Id;
    await Driver.updateOne({ _id: id},
    { $set: {VehicleImage: result.secure_url }}
    )
    .exec()
    .then(result => {
        console.log(result)
        res.status(200)
        .json({
            message: "Successfull Updated"
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                error: error
            })
        })
    })
})
router.patch('/register/:Id', (req,res) => {
    const id = req.params.Id;
    Driver.updateMany({ _id: id},
    { $set: {Fuel: req.body.Fuel,
            Nextservice: req.body.Nextservice,
            Milleage: req.body.Milleage,
            Engineoil: req.body.Engineoil,
            Batterypower: req.body.Batterypower,
            Wheelhealth: req.body.Wheelhealth}}
    )
    .exec()
    .then(result => {
        console.log(result)
        res.status(200)
        .json({
            message: "Successfull Updated"
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                error: error
            })
        })
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
        res.status(200).json(doc)
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