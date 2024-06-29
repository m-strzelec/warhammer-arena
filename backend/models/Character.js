const mongoose = require('mongoose');

const primaryStatsSchema = new mongoose.Schema({
    WS: { type: Number, required: true },
    BS: { type: Number, required: true },
    S: { type: Number, required: true },
    T: { type: Number, required: true },
    Ag: { type: Number, required: true },
    Int: { type: Number, required: true },
    WP: { type: Number, required: true },
    Fel: { type: Number, required: true }
});

const secondaryStatsSchema = new mongoose.Schema({
    A: { type: Number, required: true },
    W: { type: Number, required: true },
    SB: { type: Number, required: true },
    TB: { type: Number, required: true },
    M: { type: Number, required: true },
    Mag: { type: Number, required: true },
    IP: { type: Number, required: true },
    FP: { type: Number, required: true }
});

const characterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    race: { type: String, required: true },
    primaryStats: primaryStatsSchema,
    secondaryStats: secondaryStatsSchema,
    armor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Armor' }],
    weapons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Weapon' }],
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
    abilities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ability' }]
}, {timestamps: true});

module.exports = mongoose.model('Character', characterSchema);

