const { signupValidation, loginValidation } = require("../Middlewares/AuthValidation");
const {signup,login,updateProfile} = require("../Controllers/AuthController");
const ensureAuthenticated = require("../Middlewares/Auth");

const router = require("express").Router();

router.post("/signup",signupValidation, signup);
router.post("/login",loginValidation, login);
router.put("/update", ensureAuthenticated, updateProfile);

module.exports = router;