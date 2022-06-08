const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email:{
        type: String,
        require: true,
        min: 6,
        max:255
    }, 
    password:{
        type: String,
        require: true,
        minlength:6
    },
    name:{
        type: String,
        require: true,
        min: 6,
        max:255
    },
    lastname:{
        type: String,
        require: true,
        min: 6,
        max:255
    },
},{
    versionKey: false
});

module.exports = mongoose.model('User1', userSchema);