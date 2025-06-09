const Character = require('../models/Character');
const { getFullCharacterById } = require('../services/characterService');

async function characterRPCHandler(message) {
    const { action, characterIds, armorId, weaponId, skillId, talentId } = message;

    switch (action) {
        case 'checkCharactersExist': {
            if (!characterIds || !characterIds.length) return { valid: false };
            const count = await Character.countDocuments({ _id: { $in: characterIds } });
            return { valid: count === characterIds.length };
        }
        case 'getCharactersById': {
            const characters = await Promise.all(
                characterIds.map(id => getFullCharacterById(id))
            );
            return characters.filter(Boolean);
        }
        case 'getCharactersShortById': {
            const characters = await Character.find({ _id: { $in: characterIds } })
                .select('_id name race')
                .lean();
            return characters;
        }
        case 'checkArmorUsage': {
            if (!armorId) return { inUse: false };
            const armorsUsed = await Character.find({
                $or: [
                    { 'armor.head': armorId },
                    { 'armor.body': armorId },
                    { 'armor.leftArm': armorId },
                    { 'armor.rightArm': armorId },
                    { 'armor.leftLeg': armorId },
                    { 'armor.rightLeg': armorId }
                ]
            }).select('_id name').lean();
             return {
                inUse: armorsUsed.length > 0,
                usedBy: armorsUsed
            };
        }
        case 'checkWeaponUsage': {
            if (!weaponId) return { inUse: false };
            const weaponsUsed = await Character.find({ weapons: weaponId }).select('_id name').lean();
            return {
                inUse: weaponsUsed.length > 0,
                usedBy: weaponsUsed
            };
        }
        case 'checkSkillUsage': {
            if (!skillId) return { inUse: false };
            const skillsUsed = await Character.find({ 'skills.skill': skillId }).select('_id name').lean();
            return {
                inUse: skillsUsed.length > 0,
                usedBy: skillsUsed
            };
        }

        case 'checkTalentUsage': {
            if (!talentId) return { inUse: false };
            const talentsUsed = await Character.find({ talents: talentId }).select('_id name').lean();
            return {
                inUse: talentsUsed.length > 0,
                usedBy: talentsUsed
            };
        }
        default:
            throw new Error(`Unknown action type: ${action}`);
    }
};

module.exports = characterRPCHandler;