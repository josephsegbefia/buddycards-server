const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const flashCardSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  word: { type: String, required: true },
  translation: { type: String, default: "" },
  partOfSpeech: { type: Schema.Types.Mixed },
  conjugations: { type: Schema.Types.Mixed }
});

module.exports = model("FlashCard", flashCardSchema);
