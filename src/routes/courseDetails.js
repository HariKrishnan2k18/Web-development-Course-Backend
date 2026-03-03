import express from "express";
import axios from "axios";
import { Readable } from "stream";

const router = express.Router();

router.post("/", async (req, res) => {
  const { folderId } = req.body;
  const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents&key=${process.env.COURSE_API_KEY}&fields=files(id,name,mimeType)`;
  const response = await fetch(url).then((res) => {
    return res.json();
  });
  res.json(response.files);
});

router.get("/images", async (req, res) => {
  // const { folderId, apiKey } = req.body;
  const url = `https://www.googleapis.com/drive/v3/files?q='${process.env.COURSE_IMAGE_FOLDER}' in parents&key=${process.env.COURSE_API_KEY}&fields=files(id,name,mimeType,thumbnailLink)`;
  const response = await fetch(url).then((res) => {
    return res.json();
  });
  res.json(response.files);
});

router.get("/list", async (req, res) => {
  try {
    const getUrl = (folderId, isImage) =>
      `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${
        process.env.COURSE_API_KEY
      }&fields=files(${isImage ? "thumbnailLink" : "id"},name,mimeType)`;

    // 1️⃣ Get course list
    const folderRes = await fetch(getUrl(process.env.COURSE_FOLDER));
    const folderData = await folderRes.json();

    // 2️⃣ Get image list (with thumbnailLink)
    const imageRes = await fetch(getUrl(process.env.COURSE_IMAGE_FOLDER, true));
    const imageData = await imageRes.json();

    // 3️⃣ Match course with image using your logic
    const finalData = await Promise.all(
      folderData.files.map(async (course) => {
        const courseImage = imageData.files.find(
          (img) =>
            img.name?.replace(
              /\.(jpg|jpeg|png|webp|gif|bmp|tiff|svg|heic|avif)$/i,
              ""
            ) === course.name
        );

        // 4️⃣ Convert thumbnailLink → base64 blob (safe)
        let blob = null;

        if (courseImage?.thumbnailLink) {
          try {
            const thumbRes = await fetch(
              courseImage.thumbnailLink.replace("=s220", "=s300")
            );
            const buffer = Buffer.from(await thumbRes.arrayBuffer());
            blob = buffer.toString("base64");
          } catch (err) {
            console.log("Thumbnail error:", courseImage.thumbnailLink);
          }
        }

        return {
          ...course,
          image: blob, // base64 instead of Google URL
          mimeType: "image/jpeg",
        };
      })
    );

    res.json(finalData);
  } catch (error) {
    console.error("Error fetching course list:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

export default router;
