const router = require('express').Router()

router.get('/dashboard', (req, res)=> {
    res.json({
        data:{
            title: 'Ruta Protegida',
            user: req.user
        }
    })
});

module.exports = router;