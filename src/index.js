const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

const app = express();
const port = process.env.PORT || 3000;


//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use('/api', userRoutes);
app.use('/api', authRoutes);


//mongodb connection
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@clusterbanca.3asum.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`
mongoose
    .connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=> console.log('Connected to MongoDB Atlas'))
    .catch((error)=> console.log(error));

//routes
app.get('/', (req, res)=>{
    res.send("Bienvenido a nuestra API");
});

app.listen(port, () => {
    console.log('server listening on port', port)
});
