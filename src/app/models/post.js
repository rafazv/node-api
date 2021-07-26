const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User',
    },
    published: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    },
}, { versionKey: false });

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;