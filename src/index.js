const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const userRoutes = require('./routes/users');


const app = express();
const port = process.env.PORT || 3000;


//middleware
app.use(express.json());
app.use('/api', userRoutes);


//mongodb connection
mongoose
    .connect(process.env.MONGODB_URI)
    .then(()=> console.log('Connected to MongoDB Atlas'))
    .catch((error)=> console.log(error));

//routes
app.get('/', (req, res)=>{
    res.send("Bienvenido a nuestra API");
});

app.listen(port, () => {
    console.log('server listening on port', port)
});
