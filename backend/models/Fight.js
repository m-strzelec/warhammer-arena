const mongoose = require('mongoose');
const Int32 = require('mongoose-int32').loadType(mongoose);

const fightSchema = new mongoose.Schema({
    character1: { type: mongoose.Schema.Types.ObjectId, ref: 'Character', required: true },
    character2: { type: mongoose.Schema.Types.ObjectId, ref: 'Character', required: true },
    character1Wins: { type: Int32, default: 0, min: 0 },
    character2Wins: { type: Int32, default: 0, min: 0 },
    totalFights: { type: Int32, default: 0, min: 0 },
    lastWinner: { type: mongoose.Schema.Types.ObjectId, ref: 'Character', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Fight', fightSchema);
