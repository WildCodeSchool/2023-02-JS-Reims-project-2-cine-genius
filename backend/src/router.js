const express = require("express");

const router = express.Router();

const itemControllers = require("./controllers/itemControllers");

const questions = [
  {
    id: 1,
    text: "Quelle occasion ?",
    options: ["Entre famille", "Entre amis", "Date", "Solo"],
  },
  {
    id: 2,
    text: "Quel genre de film ?",
    options: ["Action", "Comédie", "Horreur", "Romance"],
  },
  {
    id: 3,
    text: "Date de publication",
    options: ["-3 ans", "-5 ans", "-10 ans", "-20 ans", "+20 ans"],
  },
];

// Créez une route pour récupérer les questions
router.get("/questions", (req, res) => {
  res.json(questions);
});

router.get("/items", itemControllers.browse);
router.get("/items/:id", itemControllers.read);
router.put("/items/:id", itemControllers.edit);
router.post("/items", itemControllers.add);
router.delete("/items/:id", itemControllers.destroy);

module.exports = router;
