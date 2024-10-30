const {
  createTask,
  getTasks,
  getAllUsers,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getTaskAnalytics,
  assignDashboardTasks
} = require("../Controllers/TaskController");
const ensureAuthenticated = require("../Middlewares/Auth");

const router = require("express").Router();

router.post("/tasks", ensureAuthenticated, createTask);
router.get("/tasks", ensureAuthenticated, getTasks);
router.get("/getAllUsers", ensureAuthenticated, getAllUsers);
router.put("/tasks/:id", ensureAuthenticated, updateTask);
router.delete("/tasks/:id", ensureAuthenticated, deleteTask);
router.patch("/tasks/:taskId/status", updateTaskStatus);
router.get("/tasks/analytics", ensureAuthenticated, getTaskAnalytics);
router.post("/assign-tasks", ensureAuthenticated, assignDashboardTasks);

module.exports = router;
