const router = require("express").Router();
const Profile = require("../models/Profile.model");
const User = require("../models/User.model");

router.post("/setup-profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { location, bio, interests, fullName } = req.body;

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
        interests
      });
    } else {
      //If the user already has a profile, update the existing profile
      profile.fullName = fullName;
      profile.location = location;
      profile.bio = bio;
      profile.interests = interests;
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
    const interests = profile.interests;
    const bio = profile.bio;
    const avatar = profile.avatarurl;
    const location = profile.location;

    res.json({
      user: user,
      interests: interests,
      bio: bio,
      avatar: avatar,
      location: location
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;