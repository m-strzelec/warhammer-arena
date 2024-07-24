const { rollDice } = require('../utils/diceRoll');
const SkillEffects = require('../utils/skills');

const hitLocations = [
    { range: [1, 15], location: 'head' },
    { range: [16, 35], location: 'rightArm' },
    { range: [36, 55], location: 'leftArm' },
    { range: [56, 80], location: 'body' },
    { range: [81, 90], location: 'rightLeg' },
    { range: [91, 100], location: 'leftLeg' },
];

const preprocessSkills = (character) => {
    const processedSkills = {};
    character.skills.forEach(({ skill, factor }) => {
        processedSkills[skill.name] = {
            baseChance: character.primaryStats[skill.baseStat],
            factor: factor
        };
    });
    return processedSkills;
};

const getHitLocation = (attackRoll) => {
    const reversedRoll = parseInt(attackRoll.toString().split('').reverse().join(''), 10);
    return hitLocations.find(({ range }) => reversedRoll >= range[0] && reversedRoll <= range[1])?.location || null;
};

const getPrimaryWeapon = (character) => character.weapons[0];

const getParryWeapon = (character) => {
    if (character.weapons.length > 1 && character.weapons[0].type === 'melee' && character.weapons[1].handedness === 'one-handed') {
        return character.weapons[1];
    }
    return null;
};

const getParryChance = (character, processedSkills) => {
    const parryWeapon = getParryWeapon(character);
    return parryWeapon ? SkillEffects['Parry'](processedSkills) : 0;
};

const calculateDamage = (attacker) => {
    const damageRoll = rollDice(10);
    let totalDamage = damageRoll + attacker.secondaryStats.SB;
    let furyTriggered = false;

    if (damageRoll === 10) {
        const furyAttackRoll = rollDice(100);
        if (furyAttackRoll <= attacker.primaryStats.WS) {
            furyTriggered = true;
            while (true) {
                const furyDamageRoll = rollDice(10);
                totalDamage += furyDamageRoll;
                if (furyDamageRoll !== 10) break;
            }
        }
    }

    totalDamage += attacker.weapons.length > 0 ? getPrimaryWeapon(attacker).damageFactor : -4;
    return { totalDamage: Math.max(totalDamage, 0), furyTriggered };
};

const applyDamageReduction = (damage, defender, hitLocation) => {
    const protection = defender.armor[hitLocation]?.protectionFactor || 0;
    return Math.max(damage - defender.secondaryStats.TB - protection, 0);
}

const simulateFight = async (character1, character2) => {
    const log = [];
    let character1Health = character1.secondaryStats.W;
    let character2Health = character2.secondaryStats.W;
    let winner = null;

    const character1ProcessedSkills = preprocessSkills(character1);
    const character2ProcessedSkills = preprocessSkills(character2);

    let attacker = (rollDice(20) + character1.primaryStats.Ag) >= (rollDice(20) + character2.primaryStats.Ag) ? character1 : character2;
    let defender = attacker._id.equals(character1._id) ? character2 : character1;
    let attackerSkills = attacker._id.equals(character1._id) ? character1ProcessedSkills : character2ProcessedSkills;
    let defenderSkills = defender._id.equals(character1._id) ? character1ProcessedSkills : character2ProcessedSkills;

    while (character1Health >= 0 && character2Health >= 0) {
        // Attacker's turn
        const attackRoll = rollDice(100);
        const attack = attackRoll <= attacker.primaryStats.WS;

        if (attack) {
            const hitLocation = getHitLocation(attackRoll);
            const dodgeChance = SkillEffects['Dodge Blow'](defenderSkills);
            const parryChance = getParryChance(defender, defenderSkills);

            const defenseRoll = rollDice(100);
            if ((dodgeChance >= parryChance) && (defenseRoll <= dodgeChance)) {
                log.push(`${defender.name} dodges the attack from ${attacker.name}.`);
            } else if (defenseRoll <= parryChance) {
                log.push(`${defender.name} parries the attack from ${attacker.name}.`);
            } else {
                log.push(`${attacker.name} hits ${defender.name} at ${hitLocation}.`);
                const damageResult = calculateDamage(attacker);
                let damage = applyDamageReduction(damageResult.totalDamage, defender, hitLocation);

                if (damageResult.furyTriggered) {
                    log.push(`${attacker.name} is blessed by Ulric's Fury! Roll for additional damage!`);
                }
                if (defender._id.equals(character1._id)) {
                    character1Health -= damage;
                } else {
                    character2Health -= damage;
                }
                log.push(`${defender.name} takes ${damage} damage, remaining hp: ${defender._id.equals(character1._id) ? character1Health : character2Health}.`);
                if (defender._id.equals(character1._id) ? character1Health < 0 : character2Health < 0) {
                    log.push(`${defender.name} is defeated!`);
                    winner = attacker;
                    break;
                }
            }
        } else {
            log.push(`${attacker.name} misses ${defender.name}.`);
        }
        // swap roles
        [attacker, defender] = [defender, attacker];
        [attackerSkills, defenderSkills] = [defenderSkills, attackerSkills];
    }
    log.push(`${winner.name} wins the fight!`);
    return { log, winner };
};

module.exports = {
    simulateFight
};
