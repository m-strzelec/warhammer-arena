const SkillEffects = {
    "Dodge Blow": (processedSkills) => {
        const skill = processedSkills['Dodge Blow'];
        if (!skill) return 0;
        return skill.baseChance + skill.factor;
    },
    "Parry": (processedSkills) => {
        const skill = processedSkills['Parry'];
        if (!skill) return 0;
        return skill.baseChance + skill.factor;
    },
};
  
module.exports = SkillEffects;