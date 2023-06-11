const router = require("express").Router();
const { getCategories, createCategory } = require("../controllers/categoryController");

router.get("/list", getCategories);
router.post("/create", createCategory);

module.exports = router;
