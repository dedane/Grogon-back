const mongoose = require('mongoose');

const DriverSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    Email: {type: String, required: true},
    Name: {type: String, required: true},
    Phonenumber: {type: Number, required: true},
    Password: {type: Character, required: true},
    VehicleImage: {type: String, required: true},
    PurchaseDate: {type: Date, required: true},
    Carmake: {type: String, required: true},
    Geometry: GeoSchema
})

const GeoSchema = new mongoose.Schema({
    type: {
        type: String,
        default: "Point"
    },
    coordinates: {
        type: [Number],
        index: "2dsphere"
    }
})
module.exports = mongoose.model('Driver', DriverSchema)