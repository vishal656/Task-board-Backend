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
      assignee,
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

//get  task
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    return res.status(200).json({ success: true,tasks});
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

//get user
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'email');
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



