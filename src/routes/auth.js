const express = require('express');
const userSchema = require('../models/users');
const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const bodyParser = require('body-parser');

const router = express.Router();

const schemaRegister = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
    name: Joi.string().min(5).max(12).required(),
    lastname: Joi.string().min(7).max(255).required(),
    dni: Joi.number().min(9999999).max(99999999).required(),
    number: Joi.number().min(99999999).max(999999999).required(),
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
        lastname: req.body.lastname,
        dni: req.body.dni,
        number: req.body.number
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

    //creando token
    const token = jwt.sign({ 
        id: user._id, 
        email: user.email,
        name: user.name
    }, process.env.TOKEN_SECRET);

    res.header('auth-token', token);

    res.json(['success']);
});

//ver usuarios
/*const schemaToken = Joi.object({
    token: Joi.string().min(6).max(255).required()
});*/
router.get('/authUsers', (req, res) => {
    /*const { error } = schemaToken.validate(req.body);
    if (error) {
        return res.json([error.details[0].message])
    }*/
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

//Eliminar Usuario
router.delete('/authUsers/:id', (req, res) => {
    const { id } = req.params;
    userSchema
    .findByIdAndDelete(id)
    .then(() => res.json(['deleted']))
    .catch(()=> res.json(['Error al Eliminar']));
});


/*router.put('/forgot-password', async (req,res)=> {
    const { email } = req.body;
    if (!(email)) {
        return res.json(['Email is required']);
    }

    const message = 'Revisa en tu bandeja de entrada el link para resetear tu contraseña ';

    let verificationLink;
    let emailStatus = 'OK';

    //const userData = getData(userSchema);

    //let user: user;
    try {
        await userSchema.findOne({where: { email }});
        const token = jwt.sign({id: userSchema._id, email: userSchema.email}, process.env.TOKEN_SECRET, {expiresIn: '10m'});
        verificationLink = `http://localhost:3000/newPassword/${token}`;
        userSchema.resetToken = token;
    } catch (error) {
        return res.json([message]);
    }

    //SendEmail
    try {
        //
    } catch (error) {
        emailStatus = error;
        return res.json({message: 'Algo salio mal!'});
    }

    try {
        await userSchema.updateMany(userSchema);
    } catch (error) {
        emailStatus = error;
        return res.json(['Algo salio mal!']);
    }

    res.json([{message, info: emailStatus}]);
});

router.put('/new-password', async(req, res)=>{
    const { newPassword } = req.body;
    const resetToken = req.header.reset = string;

    if (!(resetToken && newPassword)) {
        res.json(['Se requiere estos campos']);
    }
});*/


module.exports.bcrypt = bcrypt;
module.exports = router;