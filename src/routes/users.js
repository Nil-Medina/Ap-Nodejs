const express = require('express');
const userSchema = require('../models/user');

const router = express.Router();

//crear usuario
router.post('/users', (req, res) => { 
    const user = userSchema(req.body);
    user
    .save()
    .then((data)=> res.json(data))
    .catch((error)=> res.json({ message: error}));
});

//mostrar usuario
router.get('/users', (req, res)=>{
    userSchema
    .find()
    .then((data)=> res.json(data))
    .catch((error)=> res.json({ message: error}));
});

router.get('/users/:id', (req, res)=>{
    const { id } = req.params;
    userSchema
    .findById(id)
    .then((data)=> res.json(data))
    .catch((error)=> res.json({ message: error}));
});

//actualizar usuario
router.put('/users/:id', (req, res)=>{
    const { id } = req.params;
    const { email, password , data:{ name, lastname, number, dni, saldo} } = req.body;
    userSchema
    .updateOne({ _id: id},{ $set: { email, password , data:{ name, lastname, number, dni, saldo}}})
    .then((data)=> res.json(data))
    .catch((error)=> res.json({ message: 'No se actualizo'}));
});

//Eliminar usuario
router.delete('/users/:id', (req, res)=>{
    const { id } = req.params;
    userSchema
    .deleteOne({ _id: id})
    .then((data)=> res.json(data))
    .catch((error)=> res.json({ message: error}));
});




module.exports = router;
