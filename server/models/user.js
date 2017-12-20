const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

require('../config/config');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minLength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value);
            },
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    passwordSalt: {
        type: String,
        required: false
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});


/// *** INSTANCE METHODS *** ///
UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = async function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({
        _id: user._id.toHexString(),
        access
    }, process.env.TOKEN_SECRET).toString();

    user.tokens.push({ access, token });

    console.log('Saving in generate auth token...Token: ', token);
    await user.save();
    return token;
};

UserSchema.methods.removeToken = function(token) {
    try {
        const user = this;

        const index = user.tokens.findIndex((userToken) => {
            return userToken.token === token;
        });

        if (index > -1) {
            user.tokens.splice(index, 1);
            user.save();
        } else {
            console.log(`Failed to remove token for ${user.email}`);
        }
    } catch (err) {
        console.log('Error removing token\n', err);
    }
};


/// *** STATIC METHODS *** ///
UserSchema.statics.findByToken = function(token) {
    const user = this;
    let decoded;

    try {
        decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (e) {
        return Promise.reject();
    }

    return user.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.statics.loginUser = async (email, password) => {
    try {
        const existingUser = await User.findOne({
            'email': email,
        });

        if (existingUser) {
            const passwordSalt = existingUser.passwordSalt;
            const generatedPassword = await generatePasswordHash(password, passwordSalt);

            if (existingUser.password === generatedPassword) {
                const newToken = await existingUser.generateAuthToken();
                return { user: existingUser, token: newToken };
            }
        }
    } catch (e) {
        console.log('Error finding user by email / password', e);
    }
}


/// *** HOOKS *** ///
UserSchema.pre('validate', async function(next) {
    let errorMessages = [];

    let duplicates = 0;

    if (this.isModified('email')) {
        duplicates = await User.where('email', this.email).count();
    }

    if (duplicates > 0) {
        errorMessages.push(`A user with the email ${this.email} already exists`);
    }

    if (errorMessages.length > 0) {
        next(new Error(errorMessages));
    } else {
        next();
    }
});

UserSchema.pre('save', async function(next) {
    const user = this;

    if (user.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await generatePasswordHash(user.password, salt);

        if (passwordHash) {
            user.password = passwordHash;
            user.passwordSalt = salt;
        }
    }

    next();
});


/// *** HELPERS *** ///
const generatePasswordHash = async (password, salt) => {
    try {
        return await bcrypt.hash(password, salt);
    } catch (e) {
        console.log('Error in generatePasswordHash function', e);
    }
};


const User = mongoose.model('User', UserSchema);

module.exports = {
    User: User
};
