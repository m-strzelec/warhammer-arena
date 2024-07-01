const mongoose = require('mongoose');
const Int32 = require('mongoose-int32').loadType(mongoose);

const primaryStatsSchema = new mongoose.Schema({
    WS: { type: Int32, required: true, min: 0, max: 90 },
    BS: { type: Int32, required: true, min: 0, max: 90 },
    S: { type: Int32, required: true, min: 0, max: 90 },
    T: { type: Int32, required: true, min: 0, max: 90 },
    Ag: { type: Int32, required: true, min: 0, max: 90 },
    Int: { type: Int32, required: true, min: 0, max: 90 },
    WP: { type: Int32, required: true, min: 0, max: 90 },
    Fel: { type: Int32, required: true, min: 0, max: 90 }
});

const secondaryStatsSchema = new mongoose.Schema({
    A: { type: Int32, required: true, min: 0, max: 10 },
    W: { type: Int32, required: true, min: 0, max: 1000 },
    SB: { 
        type: Int32, required: true, min: 0, max: 9, 
        get: function() { return Math.floor(this.primaryStats.S / 10); }
    },
    TB: { 
        type: Int32, required: true, min: 0, max: 9, 
        get: function() { return Math.floor(this.primaryStats.T / 10); }
    },
    M: { type: Int32, required: true, min: 0, max: 10 },
    Mag: { type: Int32, required: true, min: 0, max: 10 },
    IP: { type: Int32, required: true, min: 0, max: 100 },
    FP: { type: Int32, required: true, min: 0, max: 10 }
});

const armorSchema = new mongoose.Schema({
    head: { type: mongoose.Schema.Types.ObjectId, ref: 'Armor' },
    body: { type: mongoose.Schema.Types.ObjectId, ref: 'Armor' },
    leftArm: { type: mongoose.Schema.Types.ObjectId, ref: 'Armor' },
    rightArm: { type: mongoose.Schema.Types.ObjectId, ref: 'Armor' },
    leftLeg: { type: mongoose.Schema.Types.ObjectId, ref: 'Armor' },
    rightLeg: { type: mongoose.Schema.Types.ObjectId, ref: 'Armor' }
});

const characterSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    race: { type: String, required: true },
    primaryStats: primaryStatsSchema,
    secondaryStats: secondaryStatsSchema,
    armor: armorSchema,
    weapons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Weapon' }],
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
    abilities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ability' }]
}, {timestamps: true});

module.exports = mongoose.model('Character', characterSchema);

