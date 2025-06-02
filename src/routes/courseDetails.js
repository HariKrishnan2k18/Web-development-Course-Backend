import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/", async (req, res) => {
  const { folderId, apiKey } = req.body;
  console.log(req.body, "Req Body");
  const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents&key=${apiKey}&fields=files(id,name,mimeType)`;
  //   const response = await axios.get(url);
  const response = await fetch(url).then((res) => {
    // console.log("ABC,", res);
    return res.json();
  });
  //   console.log(response);
  res.json(response.files);
});

export default router;
