const express = require('express');
const userSchema = require('../models/users');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const user = require('../models/user');

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
        return res.status(400).json(
            { error: error.details[0].message }
        )
    }

    const isEmailExist = await userSchema.findOne({ email: req.body.email });
    if (isEmailExist) {
        return res.status(500).json(
            { error : 'Email ya registrado'}
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
        return res.status(400).json({error: error.details[0].message})
    }

    const user = await userSchema.findOne({email: req.body.email});
    if (!user) {
        return res.status(400).json({error: 'Usuario no encontrado'})
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).json({error: 'Contraseña Invalida'})
    }

    res.json(['Bienvenido']);
});

//ver usuarios
router.get('/authUsers', (req, res) => {
    userSchema
    .find()
    .then((data)=> res.json(data))
    .catch((error)=> res.json({ message: error}));
});



module.exports = router;