const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
/*const findOneorFailPlugin = require('mongoose-findoneorfail');
mongoose.plugin(findOneorFailPlugin);*/

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
    password2:{
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
    token:{
        type: String
    }
},{
    versionKey: false
});

//generate token
user1Schema.methods.generateToken=function(cb){
    var user=this;
    var token = jwt.sign(user._id.toHexString(), process.env.TOKEN_SECRET);

    user.token = token;
    user.save(function(err,user){
        if(err) return cb(err);
        cb(null, user);
    });
}

//find by token
user1Schema.statics.findByToken=function(token,cb){
    var user = this;

    jwt.verify(token, process.env.TOKEN_SECRET, function(err, decode){
        user.findOne({"_id": decode, "token": token}, function(err, user){
            if(err) return cb(err);
            cb(null, user);
        })
    });
}

//delete token
user1Schema.methods.deleteToken= function(token, cb){
    var user = this;

    user.update({$unset : {token:1}},function(err,user){
        if(err) return cb(err);
        cb(null, user);
    });
}

module.exports = mongoose.model('User1', user1Schema);