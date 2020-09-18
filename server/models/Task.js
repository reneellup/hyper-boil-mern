const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    description: { type: String },
    dueDate: {
      type: Date,
      default: new Date(+new Date() + 1 * 24 * 60 * 60 * 1000),
    },
    progress: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Cascade delete task items when a task is deleted
TaskSchema.pre("remove", async function (next) {
  console.log(`Task items being removed from task ${this._id}`);
  await this.model("TaskItem").deleteMany({ taskId: this._id });
  next();
});

// Reverse populate with virtuals
TaskSchema.virtual("items", {
  ref: "TaskItem",
  localField: "_id",
  foreignField: "taskId",
  justOne: false,
});

module.exports = mongoose.model("Task", TaskSchema);
