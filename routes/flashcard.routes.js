const router = require("express").Router();
const nlp = require("de-compromise");
const translate = require("translate-google");

const FlashCard = require("../models/FlashCard.model");
const User = require("../models/User.model");

//POST /api/flashcards  - create a new card
router.post("/flashcards", (req, res, next) => {
  const { user, word, partOfSpeech, translation, conjugations } = req.body;

  FlashCard.create({
    user,
    word,
    partOfSpeech,
    translation,
    conjugations
  })
    .then((card) => {
      return User.findByIdAndUpdate(user._id, {
        $push: { flashCards: card._id }
      }).then(() =>
        res
          .status(200)
          .json({ message: "Card created successfully", user: user._id })
      );
    })
    .catch((err) => res.status(500).json({ message: "Internal Server Error" }));
});

// GET a user's flashcard collections
router.get("/users/:userId/flashcards", (req, res) => {
  const { userId } = req.params;
  let { offset = 0, limit = 0 } = req.query;
  offset = Number(offset);
  limit = Number(limit);

  FlashCard.find({ user: userId })
    .skip(offset)
    .limit(limit)
    .then((cards) => {
      res.status(200).json(cards);
    });
});

//Get one card from the users card list

router.get("/users/:userId/flashcards/:cardId", async (req, res, next) => {
  try {
    const { userId, cardId } = req.params;

    // const userID = req.user._id;
    // if (userID !== req.user._id) {
    //   return res.status(403).json({
    //     error: "You do not have the permission to view this flashcard"
    //   });
    // }
    const flashCard = await FlashCard.findOne({ _id: cardId, user: userId });

    if (!flashCard) {
      return res.status(404).json({ error: "Flashcard does not exist" });
    }
    // res.status(200).json(flashCard);
    res.status(200).json({
      word: flashCard.word,
      pos: flashCard.partOfSpeech,
      translation: flashCard.translation,
      conjugations: flashCard.conjugations
    });
  } catch (error) {
    console.error("Error getting the card:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Edit a user's flashcard

router.post(
  "/users/:userId/flashcards/:cardId/edit",
  async (req, res, next) => {
    try {
      const { userId, cardId } = req.params;
      const { word, conjugations, translation, partOfSpeech } = req.body;

      // Find the flashcard by cardId and userId and update its properties
      const updatedFlashcard = await FlashCard.findOneAndUpdate(
        { _id: cardId, user: userId },
        { word, conjugations, translation, partOfSpeech },
        { new: true }
      );

      if (!updatedFlashcard) {
        return res.status(404).json({
          error: "Flashcard not found or you don't have permission to edit it"
        });
      }

      res.status(200).json(updatedFlashcard);
    } catch (error) {
      console.error("Error updating the flashcard:", error);
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

// router.delete("/flashcards/:cardId/delete", (req, res) => {
//   const { cardId } = req.params;

//   FlashCard.findByIdAndRemove(cardId)
//     .then(() =>
//       res.json({
//         message: `Card with Id of ${cardId} is removed successfully`
//       })
//     )
//     .catch((error) => res.json(error));
// });

// get POS of the words
router.post("/word-manipulation", async (req, res, next) => {
  const { word } = req.body;

  try {
    if (!word) {
      res.status(400).json({ error: "Word parameter is required" });
      return;
    }
    //Perform German POS tagging on the word
    // const processedWord = nlp(word).normalize();
    // const taggedTokens = processedWord.out("tags");
    const doc = await nlp(word);
    const conjugations = await doc.verbs().conjugate();
    const docJson = doc.json();

    //[0].terms[0].tags;
    const translation = await translate(word, { to: "en" });

    res.json({
      pos: docJson,
      translatedWord: translation,
      conjugations: conjugations
    });
  } catch (error) {
    console.log("We could not provide part of speech:", error);
    res.status(400).json({ error: "POS tagging unsuccesful" });
  }
});

module.exports = router;
