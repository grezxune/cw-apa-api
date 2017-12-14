const mongoose = require('mongoose');
const moment = require('moment');
const { stateAbbreviations } = require('../config/states');
const { phoneValidator, emailValidator, requireOnePhone, requireOnePrimaryPhone } = require('./schema-validators');

const playerSchema = new mongoose.Schema(
    {
        name: {
            first: {
                type: String,
                required: true,
                minLength: 1,
                trim: true
            },
            middle: {
                type: String,
                required: false,
                trim: true
            },
            last: {
                type: String,
                required: true,
                minLength: 1,
                trim: true
            },
            nickname: {
                type: String,
                required: false,
                trim: true
            }
        },
        contact: {
            email: {
                type: String,
                required: true,
                unique: true,
                isAsync: true,
                trim: true,
                validate: emailValidator
            },
            phones: {
                home: {
                    isPrimary: false,
                    number: {
                        type: String,
                        required: false,
                        trim: true,
                        validate: phoneValidator
                    }
                },
                cell: {
                    isPrimary: false,
                    number: {
                        type: String,
                        required: false,
                        trim: true,
                        validate: phoneValidator
                    }
                },
                work: {
                    isPrimary: false,
                    ext: {
                        type: String,
                        required: false,
                        trim: true,
                    },
                    number: {
                        type: String,
                        required: false,
                        trim: true,
                        validate: phoneValidator
                    }
                }
            }
        },
        address: {
            street: {
                type: String,
                required: true,
                minLength: 1,
                trim: true
            },
            city: {
                type: String,
                required: true,
                minLength: 1,
                trim: true
            },
            state: {
                type: String,
                required: true,
                minLength: 1,
                trim: true,
                enum: stateAbbreviations
            },
            zipCode: {
                type: String,
                required: true,
                minLength: 1,
                trim: true
            }
        },
        personal: {
            birthdate: {
                type: Number,
                required: true,
            },
            gender: {
                type: String,
                required: false,
                trim: true,
                enum: ['Male', 'Female']
            },
            legalStatus: {
                type: String,
                required: false,
                trim: true,
                enum: ['Married', 'Single', 'Divorced', 'Widowed']
            },
            employment: {
                place: {
                    type: String,
                    required: false,
                    trim: true
                },
                occupation: {
                    type: String,
                    required: false,
                    trim: true
                }
            }
        },
        previousPlay: {
            havePlayedBefore: {
                type: Boolean,
                required: true
            },
            location: {
                type: String,
                required: false,
                trim: true
            },
            lastYearOfPlay: {
                type: String,
                required: false,
                trim: true
            },
            lastSkillLevel: {
                type: String,
                required: false,
                trim: true,
                enum: ['2', '3', '4', '5', '6', '7', 'IDR']
            }
        },
        friendInterested: {
            name: {
                first: {
                    type: String,
                    required: false,
                    trim: true
                },
                last: {
                    type: String,
                    required: false,
                    trim: true
                },
                nickname: {
                    type: String,
                    required: false,
                    trim: true
                }
            },
            phone: {
                type: String,
                required: false,
                trim: true,
                validate: phoneValidator
            }
        }
    }
);

playerSchema.pre('validate', async function(next) {
    let errorMessages = [];

    if ((!this.contact.phones.cell.number || !this.contact.phones.cell.isPrimary) &&
        (!this.contact.phones.home.number || !this.contact.phones.home.isPrimary) &&
        (!this.contact.phones.work.number || !this.contact.phones.work.isPrimary)) {
        errorMessages.push('One primary phone is required');
    }

    if (moment().diff(moment(this.personal.birthdate), 'years') < 12) {
        errorMessages.push('You must be at least 12 years of age to sign up for the APA.');
    }

    const duplicates = await Player.where('contact.email', this.contact.email).count();

    if (duplicates > 0) {
        errorMessages.push(`A player with the email ${this.contact.email} already exists.`);
    }

    if (errorMessages.length > 0) {
        next(new Error(errorMessages));
    } else {
        next();
    }
});

playerSchema.pre('save', (next) => {
    next();
});

const Player = mongoose.model('Player', playerSchema);

module.exports = {
    Player
};