const mongoose = require('mongoose');
const findOneorFailPlugin = require('mongoose-findoneorfail');
mongoose.plugin(findOneorFailPlugin);

const user1Schema = mongoose.Schema({
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
    dni:{
        type: Number,
        require: true,
        min: 9999999,
        max:99999999
    },
    number:{
        type: Number,
        require: true,
        min: 99999999,
        max:999999999
    },
},{
    versionKey: false
});

module.exports = mongoose.model('User1', user1Schema);