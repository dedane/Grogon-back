const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const multer = require('multer')
const checkAuth = require('../middleware/check-auth')
const Mechanic = require('../models/mechanic');

router.post('/register ', (req,res,next) => {
    Mechanic.find({ Email: req.body.Email })
    .exec()
    .then(Mechanic => {
        if (Mechanic.length >= 1){
            return res.status(409).json({
                message: 'You already are registered mechanic'
            })
        }
        else {
            bcrypt.hash(req.body.Password, 10, (err,hash) => {
                if (err){
                    return res.status(500).json({
                        error: err
                    })
                }
                else{
                    const Mechanic =  new Mechanic({
                        _id: new mongoose.Types.ObjectId(),
                        Email: req.body.Email,
                        Password: hash,

                        Name: req.body.Name,
                        phonenumber: req.body.phonenumber,
                        certificate: req.body.certificate,
                        mechanicPic: req.body.mechanicPic 
                    })
                Mechanic.save()
                .then(result => {
                    console.log(result)
                    res.status(201).json({
                        message: 'Successfully Registered'
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

module.exports = router;