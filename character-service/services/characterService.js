const Character = require('../models/Character');
const { sendRPCMessage } = require('../rabbitmq/rpcClient');

const getFullCharacterById = async (id) => {
    const character = await Character.findById(id);
    if (!character) {
        return null;
    }
    // Load armor
    const armorIds = Object.values(character.armor).filter(armorId => armorId);
    const armors = armorIds.length > 0
        ? await sendRPCMessage('armor_rpc_queue', { action: 'getArmorsByIds', ids: armorIds })
        : [];
    // Load weapons
    const weaponIds = character.weapons || [];
    const weapons = weaponIds.length > 0
        ? await sendRPCMessage('weapon_rpc_queue', { action: 'getWeaponsByIds', ids: weaponIds })
        : [];
    // Load skills
    const skillIds = character.skills.map(s => s.skill) || [];
    const skills = skillIds.length > 0
        ? await sendRPCMessage('skill_rpc_queue', { action: 'getSkillsByIds', ids: skillIds })
        : [];
    // Load talents
    const talentIds = character.talents || [];
    const talents = talentIds.length > 0
        ? await sendRPCMessage('talent_rpc_queue', { action: 'getTalentsByIds', ids: talentIds })
        : [];
    // Map traits from armors and weapons
    const allTraitIds = [
        ...armors.flatMap(armor => armor.traits || []),
        ...weapons.flatMap(weapon => weapon.traits || [])
    ];

    const traits = allTraitIds.length > 0
        ? await sendRPCMessage('trait_rpc_queue', { action: 'getTraitsByIds', ids: allTraitIds })
        : [];
    // Full character data
    return {
        ...character.toObject(),
        armor: mapArmor(character.armor, armors),
        weapons: weapons,
        skills: mapSkills(character.skills, skills),
        talents: talents,
        traits: traits
    };
};

const mapArmor = (armorSlots, armors) => {
    const armorMap = {};
    armors.forEach(armor => {
        for (const [slot, armorId] of Object.entries(armorSlots)) {
            if (armorId && armorId.toString() === armor._id.toString()) {
                armorMap[slot] = armor;
            }
        }
    });
    return armorMap;
};

const mapSkills = (characterSkills, skills) => {
    return characterSkills.map(cs => {
        const skill = skills.find(s => s._id.toString() === cs.skill.toString());
        return {
            skill: skill,
            advancement: cs.advancement
        };
    });
};

module.exports = {
    getFullCharacterById
};
