const mongoose = require('mongoose');

const subletSchema = new mongoose.Schema({
    name: {
        type: String
    },
    location: {
        type: String
    },
    price: {
        type: Number
    },
    phone: {
        type: String
    },
    image: [{
        data:Buffer,
        contentType:String
    }],
    date: {
        type: String
    },
    userName: {
        type: String
    },
    email: {
        type: String
    }
})

module.exports = new mongoose.model('subletCollection', subletSchema);