const router = require("express").Router();
const nlp = require("de-compromise");

const FlashCard = require("../models/FlashCard.model");
const User = require("../models/User.model");

//POST /api/flashcards  - create a new card
router.post("/flashcards", (req, res, next) => {
  const { user, word, partOfSpeech, meaning } = req.body;

  FlashCard.create({ user, word, partOfSpeech, meaning })
    .then((card) => {
      return User.findByIdAndUpdate(user._id, {
        $push: { flashCards: card._id }
      }).then(() => res.redirect("/flashcards"));
    })
    .catch((err) => res.status(500).json({ message: "Internal Server Error" }));
});

// GET a user's flashcard collections
router.get("/users/:userId/flashcards", (req, res) => {
  const { userId } = req.params;
  FlashCard.find({ userId }).then((cards) => {
    res.status(200).json(cards);
  });
});

//Edit a user's flashcard

router.post(
  ":/users/:userId/flashcards/:cardId/edit",
  async (req, res, next) => {
    try {
      const { userId, cardId } = req.params;
      const { word, meaning, partOfSpeech } = req.body;

      // const userID = req.user._id;
      // if(userID !== req.user._id){
      //     return res.status(403).json({
      //         error: "You do not have the permission to update this flashcard"
      //     });
      // }

      const flashCard = await FlashCard.findOne({ _id: cardId, userId });

      //Verify card's existence
      if (!flashCard) {
        return res.status(404).json({ error: "Flashcard does not exist" });
      }

      //update the fields
      flashCard.word = word;
      flashCard.meaning = meaning;
      flashCard.partOfSpeech = partOfSpeech;

      //Save the card
      const updatedCard = await flashCard.save();
      res.status(200).json(updatedCard);
    } catch (error) {
      console.error("Error updating the card:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.post(
  "/users/:userId/flashcards/:cardId/delete",
  async (req, res, next) => {
    try {
      const { useId, cardId } = req.params;
      // const userID = req.user._id;
      // if(userID !== req.user._id){
      //     return res.status(403).json({
      //         error: "You do not have the permission to delete this flashcard"
      //     });
      // }

      const flashCard = FlashCard.findOne({ id: cardId, useId });

      if (!flashCard) {
        return res.status(404).json({ error: "Flashcard does not exist" });
      }

      //Delete the card
      const deletedCard = await flashCard.deleteOne();
      res.status(200).json({ deletedCard });
    } catch (error) {
      console.log("Error deleting the card:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// get POS of the words
router.post("/pos-tagging", async (req, res, next) => {
  const { word } = req.body;

  try {
    if (!word) {
      res.status(400).json({ error: "Word parameter is required" });

      return;
    }
    //Perform German POS tagging on the word
    // const processedWord = nlp(word).normalize();
    // const taggedTokens = processedWord.out("tags");
    const doc = nlp(word);
    const docJson = doc.json();
    //[0].terms[0].tags;

    //JSON Output
    res.send(docJson);
  } catch (error) {
    console.log("We could not provide part of speech:", error);
    res.status(400).json({ error: "POS tagging unsuccesful" });
  }
});

module.exports = router;
