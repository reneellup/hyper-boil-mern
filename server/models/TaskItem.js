const mongoose = require("mongoose");

const TaskItemSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.ObjectId, ref: "Task", required: true },
  stepNo: { type: Number, default: 0 },
  item: { type: String },
  completed: { type: Boolean, default: false },
});

module.exports = mongoose.model("TaskItem", TaskItemSchema);
