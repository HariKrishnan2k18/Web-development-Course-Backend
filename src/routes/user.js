import express from "express";
import UsersCollection from "../models/users_schema.js";

const router = express.Router();

router.get("/", (req, res) => res.json({ message: "Hello" }).status(200));

router.post("/", async (req, res) => {
  const { user, password } = req.body;
  const userCollection = await UsersCollection.findOne({});
  let data = userCollection.users.find(
    e => e.user === user && e.password === password
  );
  if (data) {
    const { _id, password, ...remaining } = data.toObject();
    res.json(remaining).status(200);
  } else {
    res.json({ message: "No User Found" }).status(404);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { courses } = req.body;
    const userCollection = await UsersCollection.findOneAndUpdate(
      { "users.id": id },
      { $set: { "users.$.courses": courses } },
      { new: true }
    );
    if (userCollection) {
      res.json({ message: "Updated Data", userCollection }).status(200);
    } else {
      res.status(404).json({ message: "User Not Found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
