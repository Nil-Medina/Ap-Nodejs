const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const { token } = req.body;
    //const token = req.header('auth-token');

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

module.exports = verifyToken;