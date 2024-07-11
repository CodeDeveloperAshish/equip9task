const jwt = require("jsonwebtoken");

exports.generateTokens = async (user) => {
  const payload = {
    _id: user._id,
    mobileNumber: user.mobileNumber,
    firstName: user.firstName,
    lastName: user.lastName,
  };
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_PRIVATE_KEY,
    { expiresIn: "30d" }
  );

  return { accessToken, refreshToken };
};
