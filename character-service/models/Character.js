const mongoose = require('mongoose');
const Int32 = require('mongoose-int32').loadType(mongoose);
const { sendRPCMessage } = require('../rabbitmq/rpcClient');

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
    talents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Talent' }],
    userId: { type: String, required: true, index: true }
}, {timestamps: true});

characterSchema.pre('save', async function(next) {
    try {
        this.secondaryStats.SB = Math.floor(this.primaryStats.S / 10);
        this.secondaryStats.TB = Math.floor(this.primaryStats.T / 10);

        const armorIds = Object.values(this.armor).filter(id => id);
        const weaponIds = this.weapons || [];
        const skillIds = (this.skills || []).map(s => s.skill);
        const talentIds = this.talents || [];

        const [armorsExist, weaponsExist, skillsExist, talentsExist] = await Promise.all([
            armorIds.length ? sendRPCMessage('armor_rpc_queue', { action: 'checkArmorsExist', armorIds: armorIds }) : { valid: true },
            weaponIds.length ? sendRPCMessage('weapon_rpc_queue', { action: 'checkWeaponsExist', weaponIds: weaponIds }) : { valid: true },
            skillIds.length ? sendRPCMessage('skill_rpc_queue', { action: 'checkSkillsExist', skillIds: skillIds }) : { valid: true },
            talentIds.length ? sendRPCMessage('talent_rpc_queue', { action: 'checkTalentsExist', talentIds: talentIds }) : { valid: true },
        ]);
        if (!armorsExist.valid) {
            throw new Error('One or more armors do not exist');
        }
        if (!weaponsExist.valid) {
            throw new Error('One or more weapons do not exist');
        }
        if (!skillsExist.valid) {
            throw new Error('One or more skills do not exist');
        }
        if (!talentsExist.valid) {
            throw new Error('One or more talents do not exist');
        }
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('Character', characterSchema);