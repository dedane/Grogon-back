const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const Mechanic = require('../models/mechanic');

router.post('/register', (req,res,next) => {
    Mechanic.find({ Email: req.body.Email })
    .exec()
    .then(mechanic => {
        if (mechanic.length >= 1){
            return res.status(409).json({
                message: 'You already are registered mechanic'
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
                    const mechanic =  new Mechanic({
                        _id: new mongoose.Types.ObjectId(),
                        Name: req.body.Name,
                        Email: req.body.Email,

                        Certificate: req.body.Certificate,
                        MechanicPic: req.body.MechanicPic,
                        Phonenumber: req.body.Phonenumber,
                        Password: hash     
                    })
                mechanic.save()
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

router.post('/login', (req,res,next) => {
    Mechanic.find({ Email: req.body.email })
        .exec()
        .then(mechanic => {
            if (mechanic.length < 1){
                return res.status(401).json({
                    message: 'Auth Failed'
                })
            }
            bcrypt.compare(req.body.Password, Mechanic[0].password, (err,result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth Failed'
                    })
                }
                if (result){
                    const token = jwt.sign({
                        Email: Mechanic[0].email,
                        _id: Mechanic[0]._id
                    }, process.env.JWT_KEY,
                    {
                        expiresIn: '24h'
                    }
                  )
                  return res.status(200).json({
                      message: 'Auth successful',
                      token: token,
                      email: Mechanic[0].email,
                      _id: Mechanic[0]._id
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

router.get('/mechanicsLocation', (req,res,next) =>{
    Mechanic.geoNear(
        {type: 'Point',
        coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)]},
        {maxDistance: 10000,
        spherical: true}
    ).then(function(Mechanic){
        res.send(Mechanic)
    })
 })

router.get('./:MechanicId', (req,res,next) => {
    const Id = req.params.MechanicId
    Mechanic.find({ MechanicId: Id })
    .exec()
    .then( doc => {
        console.log(doc)
        res.status(500).json(doc)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ error: err})
    })
})

router.delete('./:mechanicId', (req,res,next) => {
    Mechanic.remove({
        _id: req.params.mechanicId
    })
    .exec()
    .then( result => {
        res.status(200).json({
            message: 'Mechanic Deleted',
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