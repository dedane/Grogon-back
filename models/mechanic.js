const mongoose = require('mongoose');

const MechanicSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    Name: {type: String, required: true},
    Email: {type: String, required: true},
    Certificate: {type: String, required: false},
    MechanicPic: {type: String, required: false},
    Phonenumber: {type: Number, required: true},
    Password: {type: String, required: true},
    Geometry: {type: {
        type: String,
        default: "Point"
    },
    coordinates: {
        type: [Number],
        index: "2dsphere"
    }}
})


module.exports = mongoose.model('Mechanic', MechanicSchema);