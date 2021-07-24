const express = require('express');
const User = require('../models/user').model;
const authMiddleware = require('../middlewares/auth');
const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
        const users = await User.find();

        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao carregar usuários' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ message: 'Usuário não existe' });

        return res.status(200).json(user);
    } catch (err) {
        return res.status(400).json({ message: 'Erro ao carregar usuário' });
    }
});

router.delete('/me', async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) return res.status(404).json({ message: 'Usuário não existe' });

        await User.findByIdAndRemove(req.userId);

        return res.status(204).json();
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao deletar meu usuário' });
    }
});

module.exports = app => app.use('/user', router);