const cool = require('cool-ascii-faces');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const verifyToken = require('./routes/validate-token');

const app = express();
const port = process.env.PORT || 3000;


//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());
app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', verifyToken, dashboardRoutes);



//mongodb connection
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@clusterbanca.3asum.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`
mongoose
    .connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=> console.log('Connected to MongoDB Atlas'))
    .catch((error)=> console.log(error));

//routes
//app.get('/cool', (req, res) => res.send(cool()));

app.get('/', (req, res)=>{
    res.send("<h1>Bienvenido a Nuestra API</h1>\n" + "<h2> BANCA MOVIL - GRUPO 6</h2>");
});

app.listen(port, () => {
    console.log('server listening on port', port)
});
