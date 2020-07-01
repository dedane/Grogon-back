const mongoose = require('mongoose');

const MechanicSchema = mongoose.Schema({
    _Id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    certificate: {type: String, required: true},
    mechanicPic: {type: String, required: true},
    phonenumber: {type: Number, required: true},
    passwords: {type: String, required: true},
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