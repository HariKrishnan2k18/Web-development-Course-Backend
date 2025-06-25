import express from "express";
import UsersCollection from "../models/users_schema.js";

const router = express.Router();

router.get("/", (req, res) => res.json({ message: "Hello" }).status(200));

router.post("/register", async (req, res) => {
  const { first_name, last_name, user_name, email, country, number, password } =
    req.body;
  const userCollection = await UsersCollection.findOne({});
  let data = userCollection.users.find(
    (e) => e.user === user_name || e.email === email || e.number === number
  );
  if (data) {
    res.json({ message: "User Already exist" }).status(500);
  } else {
    const object = {
      user: user_name,
      courses: [],
    };
    await UsersCollection.updateOne({
      $addToSet: {
        users: {
          id: userCollection.users.length + 1,
          firstName: first_name,
          lastName: last_name,
          email: email,
          password: password,
          country: country,
          number: number,
          ...object,
        },
      },
    });
    res.json({ message: object }).status(200);
  }
});

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
  const courseId = course.id;

  try {
    const doc = await UsersCollection.findOne({ "users.id": userId });

    if (!doc) {
      return res.status(404).json({ message: "User not found" });
    }
    const userIndex = doc.users.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found in array" });
    }

    const user = doc.users[userIndex];
    const courseIndex = user.courses.findIndex((c) => c.id == courseId);
    if (courseIndex !== -1) {
      user.courses[courseIndex] = course;
    } else {
      user.courses.push(course);
    }
    await doc.save();
    res.status(200).json({
      message: "Course added or updated successfully",
      data: doc.users[userIndex],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
