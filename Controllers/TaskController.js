const Task = require('../Models/Task');
const User = require("../Models/User");
// Create Task
exports.createTask = async (req, res) => {
  try {
    const { title,status, priority, assignee, dueDate, checklist } = req.body;
    const newTask = new Task({
      title,
      status,
      priority,
      assignee:assignee ? assignee:null,
      dueDate,
      checklist,
      user: req.user._id
    });

    await newTask.save();
    return res.status(200).json({ message: 'Task created successfully',
      success: true, task: newTask });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create task' });
  }
};

//update Task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, status, priority, assignee, dueDate, checklist } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, status, priority, assignee, dueDate, checklist },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.status(200).json({ success: true, message: 'Task updated successfully', task: updatedTask });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update task' });
  }
};

//Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete task' });
  }
};

// get tasks for assigner and assignee
exports.getTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const tasks = await Task.find({
      $or: [{ user: userId }, { assignee: req.user.email }]
    });
    return res.status(200).json({ success: true, tasks });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

//get user
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({},'name email');
    res.status(200).json({ success: true,users});
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Update task status
exports.updateTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(taskId, { status }, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.json({ success: true, task: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTaskAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    // Count tasks by status for both creator and assignee
    const statusCounts = await Task.aggregate([
      {
        $match: {
          $or: [{ user: userId }, { assignee: req.user.email }]
        }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Count tasks by priority for both creator and assignee
    const priorityCounts = await Task.aggregate([
      {
        $match: {
          $or: [{ user: userId }, { assignee: req.user.email }]
        }
      },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 }
        }
      }
    ]);

    // Count overdue tasks for both creator and assignee
    const dueTasks = await Task.countDocuments({
      $or: [{ user: userId }, { assignee: req.user.email }],
      dueDate: { $lte: new Date() }
    });

    res.status(200).json({
      success: true,
      statusCounts,
      priorityCounts,
      dueTasks
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

exports.assignDashboardTasks = async (req, res) => {
  try {
    const { assigneeEmail } = req.body;
    const assignerId = req.user._id;

    const assignee = await User.findOne({ email: assigneeEmail });
    if (!assignee) {
      return res.status(404).json({ message: 'Assignee user not found', success: false });
    }

    const result = await Task.updateMany(
      { user: assignerId },
      { $set: { assignee: assigneeEmail } }
    );

   // const modifiedCount = result.modifiedCount || result.nModified;

    return res.status(200).json({
      message: `${assigneeEmail} added to board`,
      success: true
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to assign tasks', success: false });
  }
};





