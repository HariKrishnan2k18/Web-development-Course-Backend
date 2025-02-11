import express from "express";
import fs from "fs";

const router = express.Router();
const FILE_PATH = "db.json";

const writeUsers = users =>
  fs.writeFileSync(FILE_PATH, JSON.stringify({ users }, null, 2));

const readUsers = () => JSON.parse(fs.readFileSync(FILE_PATH, "utf-8")).users;

router.post("/", async (req, res) => {
  const { user, password } = req.body;
  const response = readUsers();
  const data = response.find(e => e.user === user && e.password === password);
  if (data) {
    delete data.password;
    res.json(data).status(200);
  } else {
    res.json({ message: "No User Found" }).status(404);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const response = readUsers();
    const { id } = req.params;
    const { courses } = req.body;
    const data = { ...response.find(e => e.id === id), courses };
    writeUsers([...response.filter(e => e.id !== id), data]);
    res.json({ message: "Updated Datas" }).status(200);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

export default router;
