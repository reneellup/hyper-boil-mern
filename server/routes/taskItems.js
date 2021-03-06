const express = require("express");
const { validatorRules, validate } = require("../middleware/validator");
const {
  getAllTaskItems,
  getTaskItems,
  getTaskItem,
  addTaskItem,
  updateTaskItem,
  deleteTaskItem,
} = require("../controllers/taskItems");

const TaskItem = require("../models/TaskItem");

const router = express.Router();

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(
    protect,
    authorize("admin"),
    advancedResults(TaskItem, "taskItems"),
    getAllTaskItems
  )
  .get(protect, authorize("user", "admin"), getTaskItems);

router
  .route("/add/:taskId")
  .post(
    validatorRules("taskItems"),
    validate,
    protect,
    authorize("user", "admin"),
    addTaskItem
  );

router
  .route("/:id")
  .get(protect, authorize("user", "admin"), getTaskItem)
  .put(
    validatorRules("taskItems"),
    validate,
    protect,
    authorize("user", "admin"),
    updateTaskItem
  )
  .delete(protect, authorize("user", "admin"), deleteTaskItem);

module.exports = router;
