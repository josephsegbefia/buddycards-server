const router = require("express").Router();
const Profile = require("../models/Profile.model");
const User = require("../models/User.model");
const fileUploader = require("../config/cloudinary.config");

router.post("/upload", fileUploader.single("avatarurl"), (req, res, next) => {
  if (!req.file) {
    next(new Error("No file uploaded"));
    return;
  }
  res.json({ fileUrl: req.file.path });
});

router.post("/setup-profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { location, bio, goal, fullName, avatarurl } = req.body;

    //Find the user by the ID
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
    }

    // Check if the user already has a profile
    let profile = await Profile.findOne({ user: userId });

    if (!profile) {
      //If the user does not a profile, create a new one
      profile = await Profile.create({
        user: userId,
        location,
        bio,
        goal,
        avatarurl
      });
    } else {
      //If the user already has a profile, update the existing profile
      profile.fullName = fullName;
      profile.location = location;
      profile.bio = bio;
      profile.goal = goal;
      profile.avatarurl = avatarurl;
      await profile.save();
    }
    res.status(200).json({ profile });
  } catch (error) {
    console.error("Error setting up profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/profile/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const profile = await Profile.findOne({ user: userId }).populate("user");
    const user = profile.user.fullName;
    const goal = profile.goal;
    const bio = profile.bio;
    const avatar = profile.avatarurl;
    const location = profile.location;

    res.json({
      user: user,
      bio: bio,
      avatar: avatar,
      location: location,
      goal: goal
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
