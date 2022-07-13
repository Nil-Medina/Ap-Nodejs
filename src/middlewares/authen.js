const User = require('./../models/users');

let auth = (req, res, next)=>{
    
    const { token } = req.headers;
    if (!token) {
        return res.json(['Acceso Denegado']);
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);

        req.user = verified;

        next();
    } catch (error) {
        res.status(400).json([{error: 'Token no valido, Acceso Denegado'}]);
    }
}

module.exports={auth};