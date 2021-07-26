const express = require('express');
const authMiddleware = require('../middlewares/auth');
const Post = require('../models/post');
const Joi = require('joi');

const postSchema = Joi.object({
    _id: Joi.string(),
    title: Joi.string().required(),
    content: Joi.string().required(),
    user: Joi.string().required(),
    published: Joi.date(),
    updated: Joi.date(),
});

const router = express.Router();

router.use(authMiddleware);

router.post('/', async (req, res) => {
    const { error } = await postSchema.validate({ ...req.body, user: req.userId });

    if (error) {
        const { message } = error.details[0];
        return res.status(400).json({ message });
    }

    try {
        const post = await Post.create({ ...req.body, user: req.userId });
        const { title, content } = post;

        return res.status(201).json({ title, content, userId: req.userId });

    } catch (err) {
        return res.status(500).json({ message: 'Erro ao criar post' });
    }
});

router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('user');

        return res.status(200).json(posts);
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao carregar posts' });
    }
});

router.get('/search', async (req, res) => {
    try {
        const search = { $or: [
            { title: RegExp(req.query.q, 'i') },
            { content: RegExp(req.query.q, 'i') }
        ] };
        const post = await Post.find(search).populate('user');

        return res.status(200).json(post);
    } catch (err) {
        return res.status(400).json({ message: 'Erro ao pesquisar post(s)' });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('user');

        if (!post) return res.status(404).json({ message: 'Post não existe' });

        return res.status(200).json(post);
    } catch (err) {
        return res.status(400).json({ message: 'Erro ao carregar post' });
    }
});

router.put('/:id', async (req, res) => {
    const { error } = await postSchema.validate({ ...req.body, user: req.userId });

    if (error) {
        const { message } = error.details[0];
        return res.status(400).json({ message });
    }

    try {
        const post = await Post.findById(req.params.id);

        if (!post) 
            return res.status(404).json({ message: 'Post não existe' });
        if (req.userId.toString() !== post.user.toString()) 
            return res.status(401).json({ message: 'Usuário não autorizado' })

        const newPost = await Post.findByIdAndUpdate(req.params.id, 
            { ...req.body, updated: Date.now() }, { new: true });

        const { title, content } = newPost;

        return res.status(200).json({ title, content, userId: req.userId });

    } catch (err) {
        return res.status(400).json({ message: 'Erro ao editar post' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) 
            return res.status(404).json({ message: 'Post não existe' });
        if (req.userId.toString() !== post.user.toString()) 
            return res.status(401).json({ message: 'Usuário não autorizado' })

        await Post.findByIdAndRemove(req.params.id);

        return res.status(204).json();
    } catch (err) {
        return res.status(400).json({ message: 'Erro ao deletar post' });
    }
});

module.exports = app => app.use('/post', router);