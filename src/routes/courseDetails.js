import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/", async (req, res) => {
  const { folderId, apiKey } = req.body;
  const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents&key=${apiKey}&fields=files(id,name,mimeType)`;
  const response = await fetch(url).then((res) => {
    return res.json();
  });
  res.json(response.files);
});

export default router;
