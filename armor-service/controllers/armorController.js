const HttpStatus = require('http-status-codes');
const Armor = require('../models/Armor');
const { sendRPCMessage } = require('../rabbitmq/rpcClient');

const createArmor = async (req, res) => {
    try {
        const { name, locations, protectionFactor, traits } = req.body;
        if (!name || !locations || !protectionFactor) {
            return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ 
                message: !name ? 'No armor name was given' : 
                    !locations ? 'No armor locations were given' :
                        'No protection factor was given'
            });
        }
        const existingArmor = await Armor.findOne({ name });
        if (existingArmor) {
            return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message: 'Armor with given name already exists' });
        }
        const newArmor = new Armor({ name, locations, protectionFactor, traits });
        await newArmor.save();
        res.status(HttpStatus.StatusCodes.CREATED).json(newArmor);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error creating armor', error: error.message });
    }
};

const getArmors = async (req, res) => {
    try {
        const armors = await Armor.find();
        const allTraitIds = [...new Set(armors.flatMap(armor => armor.traits.map(id => id.toString())))];
        const traits = allTraitIds.length > 0 
            ? await sendRPCMessage('trait_rpc_queue', { action: 'getTraitsByIds', traitIds: allTraitIds }) 
            : [];
        const traitsMap = {};
        traits.forEach(trait => {
            traitsMap[trait._id] = trait;
        });
        const armorsWithTraits = armors.map(armor => {
            const armorObj = armor.toObject();
            armorObj.traits = armorObj.traits.map(id => traitsMap[id.toString()]).filter(Boolean);
            return armorObj;
        });
        res.status(HttpStatus.StatusCodes.OK).json(armorsWithTraits);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching armors', error: error.message });
    }
};

const getArmorById = async (req, res) => {
    try {
        const armor = await Armor.findById(req.params.id);
        if (!armor) {
            return res.status(HttpStatus.StatusCodes.NOT_FOUND).json({ message: 'Armor not found' });
        }
        const traitIds = armor.traits.map(id => id.toString());
        const traits = traitIds.length > 0 
            ? await sendRPCMessage('trait_rpc_queue', { action: 'getTraitsByIds', traitIds: traitIds }) 
            : [];
        const armorObj = armor.toObject();
        armorObj.traits = armorObj.traits.map(id => traits.find(trait => trait._id.toString() === id)).filter(Boolean);
        res.status(HttpStatus.StatusCodes.OK).json(armorObj);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching armor data', error: error.message });
    }
};

const updateArmor = async (req, res) => {
    try {
        const { name, locations, protectionFactor, traits } = req.body;
        if (!name || !locations || !protectionFactor) {
            return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ 
                message: !name ? 'No armor name was given' : 
                    !locations ? 'No armor locations were given' :
                        'No protection factor was given'
            });
        }

        const updatedArmor = await Armor.findByIdAndUpdate(
            req.params.id,
            { name, locations, protectionFactor, traits },
            { new: true }
        );

        if (!updatedArmor) {
            return res.status(HttpStatus.StatusCodes.NOT_FOUND).json({ message: 'Armor not found' });
        }
        res.status(HttpStatus.StatusCodes.OK).json(updatedArmor);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error updating armor', error: error.message });
    }
};

module.exports = {
    createArmor,
    getArmors,
    getArmorById,
    updateArmor
};
