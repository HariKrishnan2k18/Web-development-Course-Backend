import express from "express";
import UsersCollection from "../models/users_schema.js";

const router = express.Router();

router.get("/", (req, res) => res.json({ message: "Hello" }).status(200));

router.post("/", async (req, res) => {
  const { user, password } = req.body;
  const userCollection = await UsersCollection.findOne({});
  let data = userCollection.users.find(
    (e) => e.user === user && e.password === password
  );
  if (data) {
    const { _id, password, ...remaining } = data.toObject();
    res.json(remaining).status(200);
  } else {
    res.json({ message: "No User Found" }).status(404);
  }
});

router.patch("/:id", async (req, res) => {
  const userId = req.params.id;
  const course = req.body.courses;

  try {
    let doc = await UsersCollection.findOneAndUpdate(
      {
        "users.id": userId,
        "users.courses.id": course.id,
      },
      {
        $set: {
          "users.$[u].courses.$[c]": course,
        },
      },
      {
        new: true,
        arrayFilters: [{ "u.id": userId }, { "c.id": course.id }],
      }
    );

    if (!doc) {
      doc = await UsersCollection.findOneAndUpdate(
        { "users.id": userId },
        { $push: { "users.$.courses": course } },
        { new: true }
      );
    }

    if (!doc) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Courses updated", data: doc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
