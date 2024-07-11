const User = require("../models/user");
const { generateTokens } = require("./generateTokens");

// Register User
exports.Register = async (req, res) => {
  try {
    const { firstName, lastName, mobileNumber, password } = req.body;

    const userExist = await User.findOne({ mobileNumber: mobileNumber });

    if (userExist) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const newUser = new User({
      firstName,
      lastName,
      mobileNumber,
      password,
      refreshToken: "",
    });

    newUser
      .save()
      .then((data) => {
        res.status(201).json({ data });
      })
      .catch((error) => {
        res.status(400).json({ message: error });
      });
  } catch (error) {
    res.status(500).json({ message: "Server Timed Out" });
  }
};

// Login User
exports.Login = async (req, res) => {
  try {
    const { mobileNumber, password } = req.body;

    const userExits = await User.findOne({ mobileNumber: mobileNumber });

    if (userExits) {
      const isPassword = await userExits.matchPassword(password);
      if (isPassword) {
        const { _id, firstName, lastName, mobileNumber, refreshToken } =
          userExits;
        let tokens;
        tokens = await generateTokens(userExits);

        if (!refreshToken || refreshToken == "") {
          await User.findOneAndUpdate(
            { _id },
            { refreshToken: tokens.refreshToken }
          );
        }
        res.cookie("token", tokens.accessToken, { expiresIn: "1d" });
        return res.status(200).json({
          accessToken: tokens.accessToken,
          user: {
            _id,
            firstName,
            lastName,
            mobileNumber,
          },
        });
      } else {
        return res.status(400).json({ message: "Invalid Password" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "User not exists with this phone" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Timed Out" });
  }
};

// Get User Profile
exports.GetProfile = async (req, res) => {
  try {
    const user = await User.find({ _id: req.params.id });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server Timed Out" });
  }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.body;

    const newAccessToken = req.newAccessToken;

    User.findOneAndUpdate({ _id: id }, req.body, { new: true })
      .then((data) => {
        res.status(200).json({ accessToken: newAccessToken, user: data });
      })
      .catch((error) => {
        res.status(400).json({ error: error.message });
      });
  } catch (err) {
    res.status(500).json({ error: err.message, message: "Server Timed Out" });
  }
};

exports.deleteUser = (req, res) => {
  User.findOneAndDelete({ _id: req.params.id })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.status(400).json({ error: "Server Timed Out" });
    });
};
