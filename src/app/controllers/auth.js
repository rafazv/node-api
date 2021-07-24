const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');
const User = require('../models/user').model;

const userSchema = Joi.object({
    _id: Joi.string(),
    displayName: Joi.string().min(8),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().min(6).required(),
    image: Joi.string(),
    createdDate: Joi.date(),
});

const router = express.Router();

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400
    });
}

router.post('/user', async (req, res) => {
    const { email } = req.body;
    const { error } = await userSchema.validate(req.body);

    if (error) {
        const { message } = error.details[0];
        return res.status(400).json({ message });
    }

    try {
        if (await User.findOne({ email })) {
            return res.status(409).json({ message: 'Usuário já existe' });
        }

        const user = await User.create(req.body);

        return res.status(201).json({ token: generateToken({ id: user.id }) });
    } catch (err) {
        return res.status(500).json({ message: 'Falha ao criar novo usuário' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    const { error } = await userSchema.validate(req.body);

    if (error) {
        const { message } = error.details[0];
        return res.status(400).json({ message });
    }

    if ((!user) || (!await bcrypt.compare(password, user.password)))
        return res.status(400).json({ message: "Campos inválidos" });

    return res.status(200).json({ token: generateToken({ id: user.id }) });

});

module.exports = app => app.use('/', router);