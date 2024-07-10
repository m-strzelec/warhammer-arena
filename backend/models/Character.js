const mongoose = require('mongoose');
const Int32 = require('mongoose-int32').loadType(mongoose);
const Skill = require('./Skill');
const Talent = require('./Talent');
const Weapon = require('./Weapon');
const Armor = require('./Armor');

const characterSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    race: { type: String, enum: ['dwarf', 'elf', 'halfling', 'human', 'other'], required: true },
    primaryStats: {
        WS: { type: Int32, required: true, min: 0, max: 90 },
        BS: { type: Int32, required: true, min: 0, max: 90 },
        S: { type: Int32, required: true, min: 0, max: 90 },
        T: { type: Int32, required: true, min: 0, max: 90 },
        Ag: { type: Int32, required: true, min: 0, max: 90 },
        Int: { type: Int32, required: true, min: 0, max: 90 },
        WP: { type: Int32, required: true, min: 0, max: 90 },
        Fel: { type: Int32, required: true, min: 0, max: 90 }
    },
    secondaryStats: {
        A: { type: Int32, required: true, min: 0, max: 10 },
        W: { type: Int32, required: true, min: 0, max: 1000 },
        SB: { type: Int32, required: true, min: 0, max: 9 },
        TB: { type: Int32, required: true, min: 0, max: 9 },
        M: { type: Int32, required: true, min: 0, max: 10 },
        Mag: { type: Int32, required: true, min: 0, max: 10 },
        IP: { type: Int32, required: true, min: 0, max: 100 },
        FP: { type: Int32, required: true, min: 0, max: 10 }
    },
    armor: {
        head: { type: mongoose.Schema.Types.ObjectId, ref: 'Armor', default: null },
        body: { type: mongoose.Schema.Types.ObjectId, ref: 'Armor', default: null },
        leftArm: { type: mongoose.Schema.Types.ObjectId, ref: 'Armor', default: null },
        rightArm: { type: mongoose.Schema.Types.ObjectId, ref: 'Armor', default: null },
        leftLeg: { type: mongoose.Schema.Types.ObjectId, ref: 'Armor', default: null },
        rightLeg: { type: mongoose.Schema.Types.ObjectId, ref: 'Armor', default: null }
    },
    weapons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Weapon' }],
    skills: [
        {
            skill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
            factor: { type: Int32, required: true }
        }
    ],
    talents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Talent' }]
}, {timestamps: true});

characterSchema.pre('save', async function(next) {
    try {
        this.secondaryStats.SB = Math.floor(this.primaryStats.S / 10);
        this.secondaryStats.TB = Math.floor(this.primaryStats.T / 10);
        await Promise.all([
            Armor.find({ _id: { $in: Object.values(this.armor).filter(id => id) } }).exec(),
            Weapon.find({ _id: { $in: this.weapons } }).exec(),
            Skill.find({ _id: { $in: this.skills.map(s => s.skill) } }).exec(),
            Talent.find({ _id: { $in: this.talents } }).exec()
        ]);
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('Character', characterSchema);

