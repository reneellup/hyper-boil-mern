const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const TaskItem = require("../models/TaskItem");
const Task = require("../models/Task");

// @desc      Get all taskItems
// @route     GET /api/taskItems
// @access    Private/Admin
exports.getAllTaskItems = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get taskItems
// @route     GET /api/tasks/:taskId/taskItems
// @access    Private
exports.getTaskItems = asyncHandler(async (req, res, next) => {
  if (req.params.taskId) {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return next(
        new ErrorResponse(`Task not found with id of ${req.params.taskId}`, 404)
      );
    }

    // Make sure user is task owner
    if (task.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to view task items`,
          401
        )
      );
    }
    const taskItems = await TaskItem.find({ taskId: req.params.taskId });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: taskItems,
    });
  }
});

// @desc      Get single taskItem
// @route     GET /api/taskItems/:id
// @access    Private
exports.getTaskItem = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(
      new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is task owner
  if (task.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to view task item`,
        401
      )
    );
  }
  const taskItem = await TaskItem.findById(req.params.id);

  if (!taskItem) {
    return next(
      new ErrorResponse(`No item with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: taskItem,
  });
});

// @desc      Add task item
// @route     POST /api/tasks/:taskId/taskItems
// @access    Private
exports.addTaskItem = asyncHandler(async (req, res, next) => {
  req.body.task = req.params.taskId;
  req.body.user = req.user.id;

  const task = await Task.findById(req.params.taskId);

  if (!task) {
    return next(
      new ErrorResponse(`No task with the id of ${req.params.taskId}`, 404)
    );
  }

  // Make sure user is task owner
  if (task.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add an item to task ${bootcamp._id}`,
        401
      )
    );
  }

  const taskItem = await TaskItem.create(req.body);

  res.status(200).json({
    success: true,
    data: taskItem,
  });
});

// @desc      Update task item
// @route     PUT /api/taskItems/:id
// @access    Private
exports.updateTaskItem = asyncHandler(async (req, res, next) => {
  let taskItem = await TaskItem.findById(req.params.id);

  if (!taskItem) {
    return next(
      new ErrorResponse(`No item with the id of ${req.params.id}`, 404)
    );
  }

  const task = await Task.findById(taskItem.taskId);

  if (!task) {
    return next(
      new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is task owner
  if (task.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to modify task item`,
        401
      )
    );
  }

  taskItem = await TaskItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  taskItem.save();

  res.status(200).json({
    success: true,
    data: taskItem,
  });
});

// @desc      Delete task item
// @route     DELETE /api/taskItems/:id
// @access    Private
exports.deleteTaskItem = asyncHandler(async (req, res, next) => {
  const taskItem = await TaskItem.findById(req.params.id);

  if (!taskItem) {
    return next(
      new ErrorResponse(`No item with the id of ${req.params.id}`, 404)
    );
  }

  const task = await Task.findById(taskItem.taskId);

  if (!task) {
    return next(
      new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is task owner
  if (task.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete task item`,
        401
      )
    );
  }

  await taskItem.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
