const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  fullName: { type: String },
  flashCards: [{ type: Schema.Types.ObjectId, ref: "FlashCard" }],
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

module.exports = model("User", userSchema);
