const express = require("express");
const router = express.Router();
const { authenticate } = require("../Middleware/authenticate");
const {
  Register,
  Login,
  GetProfile,
  updateProfile,
  deleteUser,
} = require("../Controllers/userControler");

router.post("/register", Register);
router.post("/login", Login);
router.get("/getProfile/:id", GetProfile);
router.put("/update_profile", authenticate, updateProfile);
router.delete("/delete_user/:id", authenticate, deleteUser);

module.exports = router;
