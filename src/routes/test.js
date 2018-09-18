import express from "express";
import multer from "multer";
const upload = multer();
const router = express.Router();

router.post("/test", upload.array(), (req, res, next) => {
  console.log(req.body);
  res.json(req.body);
});

router.get("/test", (req, res, next) => {
  res.status(200).json({
    ok: true,
    message: "success"
  });
});

export default router;
