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
        birthdate: {
            type: Number,
            required: true,
        },
        phones: {
            required: [
                () => {requireOnePhone() && requireOnePrimaryPhone()},
                'At least one primary phone is required'
            ],
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
                    type: Number,
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
        },
        email: {
            type: String,
            required: true,
            unique: true,
            isAsync: true,
            trim: true,
            validate: emailValidator
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
        },
        gender: {
            type: String,
            required: false,
            trim: true,
            enum: ["Male", "Female"]
        },
        legalStatus: {
            type: String,
            required: false,
            trim: true,
            enum: ["Married", "Single", "Divorced", "Widowed"]
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
                type: Number,
                required: false,
                minValue: 1,
                maxValue: 9
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

const Player = mongoose.model('Player', playerSchema);

module.exports = {
  Player
};