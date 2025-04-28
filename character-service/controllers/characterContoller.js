const HttpStatus = require('http-status-codes');
const Character = require('../models/Character');
const sendRPCMessage = require('../utils/rpcClient');

const createCharacter = async (req, res) => {
    try {
        const { name, race, primaryStats, secondaryStats, armor, weapons, skills, talents } = req.body;
        if (!name || !race || !primaryStats) {
            return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ 
                message: !name ? 'No character name was given' : 
                    !race ? 'No character race was given' :
                        !primaryStats ? 'No primary stats were given' :
                            'No secondary stats were given'
            });
        }
        const existingCharacter = await Character.findOne({ name });
        if (existingCharacter) {
            return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message: 'Character with given name already exists' });
        }
        const newCharacter = new Character({ name, race, primaryStats, secondaryStats, armor, weapons, skills, talents });
        await newCharacter.save();
        res.status(HttpStatus.StatusCodes.CREATED).json(newCharacter);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error creating character', error: error.message });
    }
};

const getCharacters = async (req, res) => {
    try {
        const characters = await Character.find({}, '_id name');
        res.status(HttpStatus.StatusCodes.OK).json(characters);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching characters', error: error.message });
    }
};

const getCharacterById = async (req, res) => {
    try {
        const character = await Character.findById(req.params.id);
        if (!character) {
            return res.status(HttpStatus.StatusCodes.NOT_FOUND).json({ message: 'Character not found' });
        }
        const armorIds = Object.values(character.armor).filter(id => id);
        const weaponIds = character.weapons || [];
        const skillIds = (character.skills || []).map(s => s.skill);
        const talentIds = character.talents || [];

        const [armors, weapons, skills, talents] = await Promise.all([
            armorIds.length ? sendRPCMessage('armor_rpc_queue', { action: 'findArmorsByIds', ids: armorIds }) : [],
            weaponIds.length ? sendRPCMessage('weapon_rpc_queue', { action: 'findWeaponsByIds', ids: weaponIds }) : [],
            skillIds.length ? sendRPCMessage('skill_rpc_queue', { action: 'findSkillsByIds', ids: skillIds }) : [],
            talentIds.length ? sendRPCMessage('talent_rpc_queue', { action: 'findTalentsByIds', ids: talentIds }) : [],
        ]);
        const armorTraitsIds = armors.flatMap(a => a.traits || []);
        const weaponTraitsIds = weapons.flatMap(w => w.traits || []);
        const allTraitsIds = [...new Set([...armorTraitsIds, ...weaponTraitsIds])];
        const traits = allTraitsIds.length ? await sendRPCMessage('trait_rpc_queue', { action: 'findTraitsByIds', ids: allTraitsIds }) : [];
        const populatedArmors = armors.map(armor => ({
            ...armor,
            traits: (armor.traits || []).map(traitId => traits.find(t => t._id === traitId.toString()))
        }));
        const populatedWeapons = weapons.map(weapon => ({
            ...weapon,
            traits: (weapon.traits || []).map(traitId => traits.find(t => t._id === traitId.toString()))
        }));
        const populatedCharacter = {
            ...character.toObject(),
            armor: {
                head: populatedArmors.find(a => a._id === character.armor.head?.toString()) || null,
                body: populatedArmors.find(a => a._id === character.armor.body?.toString()) || null,
                leftArm: populatedArmors.find(a => a._id === character.armor.leftArm?.toString()) || null,
                rightArm: populatedArmors.find(a => a._id === character.armor.rightArm?.toString()) || null,
                leftLeg: populatedArmors.find(a => a._id === character.armor.leftLeg?.toString()) || null,
                rightLeg: populatedArmors.find(a => a._id === character.armor.rightLeg?.toString()) || null,
            },
            weapons: populatedWeapons,
            skills: (character.skills || []).map(s => {
                const skill = skills.find(skill => skill._id === s.skill.toString());
                return skill ? { ...s.toObject(), skill } : s;
            }),
            talents: talents
        };
        res.status(HttpStatus.StatusCodes.OK).json(populatedCharacter);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching character data', error: error.message });
    }
};

module.exports = {
    createCharacter,
    getCharacters,
    getCharacterById
};