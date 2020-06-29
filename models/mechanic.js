const mongoose = require('mongoose');

const mechanicSchema = mongoose.Schema({
    _Id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    certificate: {type: String, required: true},
    mechanicPic: {type: String, required: true},
    phonenumber: {type: Number, required: true},
    passwords: {type: String, required: true}
})

module.exports = mongoose.model('Mechanic', mechanicSchema);