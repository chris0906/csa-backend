const express = require("express");
const router = express.Router();
const {
  find,
  findById,
  create,
  update,
  checkTopicExist,
  listPosts
} = require("../controller/topic");
const auth = require("../middleware/authUser");

router.get("/", find);
router.post("/", auth, create);
router.get("/:id", checkTopicExist, findById);
router.patch("/:id", auth, checkTopicExist, update);
router.get("/:id/posts", listPosts);

module.exports = router;
