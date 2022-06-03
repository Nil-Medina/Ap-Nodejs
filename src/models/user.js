const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email:{
        type: String,
        require: true
    }, 
    password:{
        type: String,
        require: true
    },
    data:{
        name:{
            type: String,
            require: true
        },
        lastname:{
            type: String,
            require: true
        },
        number: {
            type: Number,
            require: true
        },
        dni:{
            type: Number,
            require: true
        },
        saldo:{
            type: Number,
            require: true
        }          
    }  
});

module.exports = mongoose.model('User', userSchema);