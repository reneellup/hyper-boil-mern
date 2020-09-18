const express = require("express");
const { validatorRules, validate } = require("../middleware/validator");
const {
  getUsers,
  getUser,
  // createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");

const User = require("../models/User");

// Include other resource routers
const taskRouter = require("./tasks");

const router = express.Router({ mergeParams: true });

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

// Re-route into other resource routers
router.use("/:userId/tasks", taskRouter);
router.use("/:userId/tasks/:id", taskRouter);

router.use(protect);
router.use(authorize("admin"));

router.route("/").get(advancedResults(User), getUsers);
// .post(validatorRules("users"), validate, createUser);

router
  .route("/:id")
  .get(getUser)
  .put(validatorRules("users"), validate, updateUser)
  .delete(deleteUser);

module.exports = router;
