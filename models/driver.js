const mongoose = require('mongoose');

const driverSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    phonenumber: {type: Number, required: true},
    password: {type: Character, required: true},
    vehicleImage: {type: String, required: true},
    PurchaseDate: {type: Date, required: true},
    carmake: {type: String, required: true}
})

module.exports = mongoose.model('Driver', driverSchema)