const Character = require('../models/Character');
const { sendRPCMessage } = require('../rabbitmq/rpcClient');

const getFullCharacterById = async (id) => {
    try {
        const character = await Character.findById(id);
        if (!character) {
            return null;
        }
        
        const armorIds = Object.values(character.armor || {}).filter(armorId => armorId);
        const weaponIds = character.weapons || [];
        const skillIds = character.skills?.map(s => s.skill) || [];
        const talentIds = character.talents || [];

        const [armorsResponse, weaponsResponse, skillsResponse, talentsResponse] = await Promise.all([
            armorIds.length > 0 
                ? sendRPCMessage('armor_rpc_queue', { action: 'getArmorsByIds', armorIds: armorIds }) 
                : Promise.resolve({ armors: [] }),
            weaponIds.length > 0 
                ? sendRPCMessage('weapon_rpc_queue', { action: 'getWeaponsByIds', weaponIds: weaponIds }) 
                : Promise.resolve({ weapons: [] }),
            skillIds.length > 0 
                ? sendRPCMessage('skill_rpc_queue', { action: 'getSkillsByIds', skillIds: skillIds }) 
                : Promise.resolve({ skills: [] }),
            talentIds.length > 0 
                ? sendRPCMessage('talent_rpc_queue', { action: 'getTalentsByIds', talentIds: talentIds }) 
                : Promise.resolve({ talents: [] })
        ]);

        const armors = armorsResponse?.armors || [];
        const weapons = weaponsResponse?.weapons || [];
        const skills = skillsResponse?.skills || [];
        const talents = talentsResponse?.talents || [];
        // Map traits from armors and weapons
        const armorTraitIds = armors.flatMap(armor => armor.traitIds || []);
        const weaponTraitIds = weapons.flatMap(weapon => weapon.traitIds || []);
        const allTraitIds = [...new Set([...armorTraitIds, ...weaponTraitIds])];
        const traitsResponse = allTraitIds.length > 0
                ? await sendRPCMessage('trait_rpc_queue', { action: 'getTraitsByIds', traitIds: allTraitIds })
                : { traits: [] };
        const traits = traitsResponse?.traits || [];
        const enrichedArmors = enrichTraits(armors, traits);
        const enrichedWeapons = enrichTraits(weapons, traits);
        // Full character data
        const characterObj = character.toObject();
        return {
            ...characterObj,
            armor: mapArmor(character.armor || {}, enrichedArmors),
            weapons: enrichedWeapons,
            skills: mapSkills(character.skills || [], skills),
            talents: talents,
        };
    } catch (error) {
        console.error(`Error fetching full character data for ID ${id}:`, error);
        throw new Error(`Failed to retrieve full character data: ${error.message}`);
    }
};

const mapArmor = (armorSlots, armors) => {
    const armorMap = {
        head: null,
        body: null,
        leftArm: null,
        rightArm: null, 
        leftLeg: null,
        rightLeg: null,
        ...armorSlots
    };

    const armorById = armors.reduce((map, armor) => {
        map[armor._id.toString()] = armor;
        return map;
    }, {});

    for (const slot of ['head', 'body', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg']) {
        const armorId = armorSlots[slot];
        if (armorId) {
            const armorIdStr = armorId.toString();
            armorMap[slot] = armorById[armorIdStr] || null;
        }
    }
    return armorMap;
};

const mapSkills = (characterSkills, skills) => {
    const skillById = skills.reduce((map, skill) => {
        map[skill._id.toString()] = skill;
        return map;
    }, {});

    return characterSkills.map(cs => {
        const skillId = cs.skill?.toString();
        return {
            skill: skillId ? skillById[skillId] || cs.skill : cs.skill,
            factor: cs.factor
        };
    });
};

const enrichTraits = (items, traits) => {
    const traitById = traits.reduce((map, trait) => {
        map[trait._id.toString()] = trait;
        return map;
    }, {});

    return items.map(item => {
        if (!item.traitIds) return item;
        return {
            ...item,
            traits: item.traitIds.map(id => traitById[id.toString()]).filter(Boolean)
        };
    });
};

module.exports = {
    getFullCharacterById
};
