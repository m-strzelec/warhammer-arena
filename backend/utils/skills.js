const { rollDice } = require("./diceRoll");

const SkillEffects = {
    "dodge blow": (processedSkills) => {
        const skill = processedSkills['dodge blow'];
        if (!skill) return false;
        const dodgeChance = skill.baseChance + skill.factor;
        return rollDice(100) <= dodgeChance;
    }
    // TODO: Add effects
};
  
  module.exports = SkillEffects;
  