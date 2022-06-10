const express = require('express');
const userSchema = require('../models/users');
const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');
//const user = require('../models/user');

const router = express.Router();

const schemaRegister = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
    name: Joi.string().min(6).max(255).required(),
    lastname: Joi.string().min(6).max(255).required(),
})

//crear usuario
router.post('/register', async (req, res) => {

    const { error } = schemaRegister.validate(req.body);

    if (error) {
        return res.json(
            [error.details[0].message]
        )
    }

    const isEmailExist = await userSchema.findOne({ email: req.body.email });
    if (isEmailExist) {
        return res.json(
            ['Email ya registrado']
        )
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt)


    const user = userSchema({
        email: req.body.email,
        password: password,
        name: req.body.name,
        lastname: req.body.lastname
    });

    try {
        await user.save()
        res.json(['Usuario Creado']);
    } catch (error) {
        res.status(400).json({error});
    }
});

//Ingresar usuario
const schemaLogin = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
});

router.post('/login', async (req, res) => {
    
    const { error } = schemaLogin.validate(req.body);
    if (error) {
        return res.json([error.details[0].message])
    }

    const user = await userSchema.findOne({email: req.body.email});
    if (!user) {
        return res.json(['usuario no registrado'])
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.json(['contraseña incorrecta'])
    }

    res.json(['success']);
});

//ver usuarios
router.get('/authUsers', (req, res) => {
    userSchema
    .find()
    .then((data)=> res.json(data))
    .catch((error)=> res.json({ message: error}));
});

//buscar usuario por id
router.get('/authUsers/:id', (req, res)=>{
    const { id } = req.params;
    userSchema
    .findById(id)
    .then((data)=> res.json(data))
    .catch((error)=> res.json({ message: error}));
});


module.exports.bcrypt = bcrypt;
module.exports = router;