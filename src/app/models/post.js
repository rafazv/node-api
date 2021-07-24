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
});

PostSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.__v;

    return obj;
};

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;