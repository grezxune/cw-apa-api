const mongoose = require('mongoose');
const {phoneValidator} = require('./schema-validators');

const teamSchema = new mongoose.Schema({
    divisionName: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    },
    teamName: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    },
    homeLocation: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    },
    dayOfPlay: {
        type: String,
        required: true,
        minLength: 2,
        trim: true,
        enum: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    },
    existingTeam: {
        type: Boolean,
        required: true,
        default: false
    },
    useCurrentRoster: {
        type: Boolean,
        required: true,
        default: false
    },
    players: [
        {
            isCaptain: {
                type: Boolean,
                required: true,
                default: false
            },
            isCoCaptain: {
                type: Boolean,
                required: true,
                default: false
            },
            name: {
                first: {
                    type: String,
                    required: true,
                    minLength: 1,
                    trim: true
                },
                last: {
                    type: String,
                    required: true,
                    minLength: 1,
                    trim: true
                }
            },
            phone: {
                canText: {
                    type: Boolean,
                    required: true,
                    default: false
                },
                number: {
                    type: String,
                    required: false,
                    trim: true,
                    validate: phoneValidator
                }
            }
        }
    ]
});

// Do not allow any teams to have a duplicate name in a single division
teamSchema.index({ divisionName: 1, teamName: -1 }, { unique: true });

const Team = mongoose.model('Team', teamSchema);

module.exports = {
    Team
};