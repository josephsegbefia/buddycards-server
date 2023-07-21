const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const flashCardSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  word: { type: String, required: true },
  partOfSpeech: { type: String, default: "" },
  meaning: { type: String, required: true }
});

module.exports = model("FlashCard", flashCardSchema);
