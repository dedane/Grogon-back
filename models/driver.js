const mongoose = require('mongoose');

const DriverSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    phonenumber: {type: Number, required: true},
    password: {type: Character, required: true},
    vehicleImage: {type: String, required: true},
    PurchaseDate: {type: Date, required: true},
    carmake: {type: String, required: true},
    geometry: GeoSchema
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