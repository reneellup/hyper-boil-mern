const express = require("express");
const {
  getTasks,
  getTask,
  getUserTasks,
  getUserTask,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/tasks");

const Task = require("../models/Task");

// Include other resource routers
const itemRouter = require("./taskItems");

const router = express.Router();

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

// Re-route into other resource routers
router.use("/:taskId/taskItems", itemRouter);

router
  .route("/")
  .get(protect, authorize("admin"), advancedResults(Task, "tasks"), getTasks)
  .post(protect, authorize("user", "admin"), createTask);

router
  .route("/:id")
  .get(protect, authorize("user", "admin"), getTask)
  .put(protect, authorize("user", "admin"), updateTask)
  .delete(protect, authorize("user", "admin"), deleteTask);

router
  .route("/:userId/:id")
  .get(protect, authorize("user", "admin"), getUserTask);

module.exports = router;
