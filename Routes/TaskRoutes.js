const { createTask, getTasks } = require('../Controllers/TaskController');
const ensureAuthenticated = require('../Middlewares/Auth');

const router = require("express").Router();

router.post('/tasks', ensureAuthenticated, createTask);
router.get('/tasks', ensureAuthenticated, getTasks);

module.exports = router;
