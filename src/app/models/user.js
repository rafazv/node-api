const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    displayName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'invalid-email']
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    image: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
        select: false
    },
});

UserSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
});

UserSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.__v;

    return obj;
};

module.exports = {
    model: mongoose.model('User', UserSchema),
    schema: UserSchema,
};