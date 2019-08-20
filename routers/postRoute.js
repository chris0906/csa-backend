const express = require("express");
const router = express.Router();
const { find, findById, create, update } = require("../controller/post");
const auth = require("../middleware/authUser");

router.get("/", find);
router.post("/", auth, create);
router.get("/:id", findById);
router.patch("/:id", auth, update);

module.exports = router;
