db = db.getSiblingDB(process.env.MONGO_DB);

db.createCollection('traits');
db.createCollection('skills');
db.createCollection('talents');
db.createCollection('weapons');
db.createCollection('armors');
db.createCollection('characters');
db.createCollection('fights');

// Traits
db.traits.insertMany([
    {
        name: 'Fast',
        description: 'Gives enemy -10 to parry/dodge.'
    },
    {
        name: 'Slow',
        description: 'Gives enemy +10 to parry/dodge.'
    }
]);
  
// Skills
db.skills.insertMany([
    {
        name: 'Dodge Blow',
        baseStat: 'Ag',
        description: 'Allows character to dodge attacks.'
    },
    {
        name: 'Parry',
        baseStat: 'WS',
        description: 'Allows character to parry attacks.'
    }
]);
  
// Talents
db.talents.insertMany([
    {
        name: 'Strike Mighty Blow',
        description: 'Increases damage dealt by 1.'
    }
]);
  
// Weapons
db.weapons.insertMany([
    {
        name: 'Dwarven Axe',
        damageFactor: 2,
        traits: [],
        type: 'melee',
        handedness: 'one-handed'
    },
    {
        name: 'Elven Sword',
        damageFactor: 0,
        traits: [db.traits.findOne({ name: 'Fast' })._id],
        type: 'melee',
        handedness: 'one-handed'
    },
    {
        name: 'Shield',
        damageFactor: -2,
        traits: [],
        type: 'melee',
        handedness: 'one-handed'
    },
]);
  
// Armors
db.armors.insertMany([
    {
        name: 'Leather Cap',
        locations: ['head'],
        protectionFactor: 1,
        traits: []
    },
    {
        name: 'Leather Armor',
        locations: ['head', 'body', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'],
        protectionFactor: 1,
        traits: []
    },
    {
        name: 'Chainmail',
        locations: ['body', 'leftArm', 'rightArm'],
        protectionFactor: 3,
        traits: []
    }
]);
  
// Characters
db.characters.insertMany([
    {
        name: 'Thorin Oakenshield',
        race: 'dwarf',
        primaryStats: {
            WS: 45,
            BS: 35,
            S: 40,
            T: 50,
            Ag: 30,
            Int: 25,
            WP: 40,
            Fel: 20
        },
        secondaryStats: {
            A: 1,
            W: 12,
            SB: 4,
            TB: 5,
            M: 3,
            Mag: 0,
            IP: 0,
            FP: 2
        },
        armor: {
            head: db.armors.findOne({ name: 'Leather Cap' })._id,
            body: db.armors.findOne({ name: 'Chainmail' })._id,
            leftArm: db.armors.findOne({ name: 'Chainmail' })._id,
            rightArm: db.armors.findOne({ name: 'Chainmail' })._id,
            leftLeg: null,
            rightLeg: null
        },
        weapons: [
            db.weapons.findOne({ name: 'Dwarven Axe' })._id,
            db.weapons.findOne({ name: 'Shield' })._id
        ],
        skills: [
            {
                skill: db.skills.findOne({ name: 'Parry' })._id,
                factor: 20
            },
        ],
        talents: [
            db.talents.findOne({ name: 'Strike Mighty Blow' })._id
        ],
        userId: 'ac8349eb-7982-4d71-b713-aee5939dd90f' // Test Id
    },
    {
        name: 'Aragorn',
        race: 'human',
        primaryStats: {
            WS: 50,
            BS: 50,
            S: 45,
            T: 40,
            Ag: 40,
            Int: 35,
            WP: 45,
            Fel: 30
        },
        secondaryStats: {
            A: 2,
            W: 15,
            SB: 4,
            TB: 4,
            M: 4,
            Mag: 0,
            IP: 0,
            FP: 3
        },
        armor: {
            head: db.armors.findOne({ name: 'Leather Armor' })._id,
            body: db.armors.findOne({ name: 'Leather Armor' })._id,
            leftArm: db.armors.findOne({ name: 'Leather Armor' })._id,
            rightArm: db.armors.findOne({ name: 'Leather Armor' })._id,
            leftLeg: db.armors.findOne({ name: 'Leather Armor' })._id,
            rightLeg: db.armors.findOne({ name: 'Leather Armor' })._id
        },
        weapons: [
            db.weapons.findOne({ name: 'Elven Sword' })._id,
            db.weapons.findOne({ name: 'Shield' })._id
        ],
        skills: [
            {
                skill: db.skills.findOne({ name: 'Parry' })._id,
                factor: 0
            },
            {
                skill: db.skills.findOne({ name: 'Dodge Blow' })._id,
                factor: 20
            }
        ],
        talents: [],
        userId: 'ac8349eb-7982-4d71-b713-aee5939dd90f' // Test Id
    }
]);
