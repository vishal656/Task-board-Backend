const UserModel = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body; // confirmPassword is already stripped here
    const user = await UserModel.findOne({ email });

    if (user) {
      return res.status(409).json({ message: "User already exists", success: false });
    }

    const newUser = new UserModel({ name, email, password });
    newUser.password = await bcrypt.hash(password, 10); // Hash the password
    await newUser.save();

    res.status(201).json({ message: "User created successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    const errorMsg = "Auth failed email or password is wrong";
    if (!user) {
      return res.status(403).json({ message: errorMsg, success: false });
    }
    const ispassEqual = await bcrypt.compare(password, user.password);
    if (!ispassEqual) {
      return res.status(403).json({ message: errorMsg, success: false });
    }
    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res
      .status(200)
      .json({ message: "Login successfully", success: true,jwtToken,email,name:user.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error", success: false });
  }
};

module.exports = {
  signup,
  login
};
