const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Task = require("../models/Task");

// @desc      Get all tasks
// @route     GET /api/tasks
// @access    Private/Admin
exports.getTasks = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single task
// @route     GET /api/tasks/:id
// @access    Private/Admin
exports.getTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id).populate({
    path: "taskItem",
    select: "stepNo item",
  });

  // Make sure user is task owner
  if (task.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to view this task`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

// @desc      Get tasks by user
// @route     GET /api/users/:userId/tasks
// @access    Private
exports.getUserTasks = asyncHandler(async (req, res, next) => {
  if (req.params.userId) {
    const tasks = await Task.find({ user: req.params.userId });

    if (!tasks) {
      return next(
        new ErrorResponse(`No tasks belongs to ${req.params.userId}`, 404)
      );
    }

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  }
});

// @desc      Get single task by user
// @route     GET /api/users/:userId/tasks/:id
// @access    Private
exports.getUserTask = asyncHandler(async (req, res, next) => {
  if (req.params.userId && req.params.id) {
    const task = await Task.find({
      user: req.params.userId,
      _id: req.params.id,
    }).populate({
      path: "taskItem",
      select: "stepNo item",
    });

    if (!task) {
      return next(
        new ErrorResponse(
          `No task with an id of ${req.params.id} and belongs to ${req.params.userId}`,
          404
        )
      );
    }

    return res.status(200).json({
      success: true,
      data: task,
    });
  }
});

// @desc      Create new task
// @route     POST /api/tasks
// @access    Private
exports.createTask = asyncHandler(async (req, res, next) => {
  // Add user to req,body
  req.body.user = req.user.id;

  const task = await Task.create(req.body);

  res.status(201).json({
    success: true,
    data: task,
  });
});

// @desc      Update task
// @route     PUT /api/tasks/:id
// @access    Private
exports.updateTask = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return next(
      new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is task owner
  if (task.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this task`,
        401
      )
    );
  }

  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: task });
});

// @desc      Delete task
// @route     DELETE /api/tasks/:id
// @access    Private
exports.deleteTask = asyncHandler(async (req, res, next) => {
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
        `User ${req.user.id} is not authorized to delete this task`,
        401
      )
    );
  }

  await task.remove();

  res.status(200).json({ success: true, data: {} });
});
