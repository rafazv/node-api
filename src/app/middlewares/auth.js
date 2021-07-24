const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).json({ message: 'Token não encontrado' });

    const parts = authHeader.split(' ');
    // if(!parts.length === 2) return res.status(401).json({ message: 'Erro no token' });

    const [ scheme, token ] = parts;
    // if(!/^Bearer$/i.test(scheme)) return res.status(401).json({ message: 'Token mal formado' });

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token expirado ou inválido' });

        req.userId = decoded.id;
        return next();
    });
};