const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const profileSchema = new Schema(
  {
    fullName: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    location: { type: String },
    bio: { type: String },
    avatarurl: { type: String },
    goal: { type: String },
    flashCards: { type: Number }
  },
  {
    timestamps: true
  }
);

module.exports = model("Profile", profileSchema);
