const { rollDice } = require('../utils/diceRoll');
const Weapon = require('../models/Weapon');
const Skill = require('../models/Skill');
const SkillEffects = require('../utils/skills');

const preprocessSkills = (character) => {
    const processedSkills = {};
    if (character.skills.length > 0) {
        character.skills.forEach(skill => {
            processedSkills[skill.skill.name] = {
                baseChance: character.primaryStats[skill.skill.baseStat],
                factor: skill.factor
            };
        });
    }
    return processedSkills;
};

const calculateDamage = async (attacker, defender) => {
  let damage = rollDice(10) + attacker.secondaryStats.SB - defender.secondaryStats.TB;
  if (attacker.weapons.length > 0) {
    const weapon = await Weapon.findById(attacker.weapons[0]);
    damage += weapon.damageFactor;
  } else {
    damage -= 4;
  }
  return Math.max(0, damage);
};

const simulateFight = async (character1, character2) => {
    const log = [];
    let character1Health = character1.secondaryStats.W;
    let character2Health = character2.secondaryStats.W;
    let winner = null;

    const character1ProcessedSkills = preprocessSkills(character1);
    const character2ProcessedSkills = preprocessSkills(character2);

    while (character1Health > 0 && character2Health > 0) {
        const attack1 = rollDice(100) <= (character1.primaryStats.WS);
        if (attack1) {
            if (SkillEffects['dodge blow'](character2ProcessedSkills)) {
                log.push(`${character2.name} dodges the attack from ${character1.name}`);
            } else {
                log.push(`${character1.name} hits ${character2.name}`);
                const damage = await calculateDamage(character1, character2);
                character2Health -= damage;
                log.push(`${character2.name} takes ${damage} damage, remaining hp: ${character2Health}`);
                if (character2Health <= 0) {
                    log.push(`${character2.name} is defeated!`);
                    winner = character1;
                }
            }
        } else {
            log.push(`${character1.name} misses ${character2.name}`);
        }

        if (character2Health <= 0) break;

        const attack2 = rollDice(100) <= (character2.primaryStats.WS);
        if (attack2) {
            if (SkillEffects['dodge blow'](character1ProcessedSkills)) {
                log.push(`${character1.name} dodges the attack from ${character2.name}`);
            } else {
                log.push(`${character2.name} hits ${character1.name}`);
                const damage = await calculateDamage(character2, character1);
                character1Health -= damage;
                log.push(`${character1.name} takes ${damage} damage, remaining hp: ${character1Health}`);
                if (character1Health <= 0) {
                    log.push(`${character1.name} is defeated!`);
                    winner = character2;
                }
            }
        } else {
            log.push(`${character2.name} misses ${character1.name}`);
        }    
    }
    log.push(`${winner.name} wins the fight!`);
    return { log, winner };
};

module.exports = {
    simulateFight
};
