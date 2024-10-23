const Task = require('../Models/Task');
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

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    return res.status(200).json({ success: true,tasks});
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};
