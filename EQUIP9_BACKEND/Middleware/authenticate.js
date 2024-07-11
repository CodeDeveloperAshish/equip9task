const jwt = require("jsonwebtoken");
const { generateTokens } = require("../Controllers/generateTokens");
// const { generateTokens } = require("../Controllers/userControler");

exports.authenticate = async (req, res, next) => {
  const authorization = req.headers["authorization"];

  let accessToken;
  if (authorization) {
    accessToken = authorization.split(" ");
    if (!accessToken[1]) {
      return res.status(401).json({ error: true, message: "Invalid Headers" });
    }
  }

  try {
    const verifyToken = jwt.verify(
      accessToken[1],
      process.env.ACCESS_TOKEN_PRIVATE_KEY,
      (err, result) => ({ err, result })
    );
    // Decode the JWT
    const decodedJwt = jwt.decode(accessToken[1]);
    let newAccessToken;
    if (verifyToken.err) {
      newAccessToken = await generateTokens(decodedJwt);
    } else {
      newAccessToken = await generateTokens(verifyToken.result);
    }
    req.newAccessToken = newAccessToken.accessToken;
    next();
  } catch (err) {
    res.status(401).json({ error: true, message: "Unauthorized User" });
  }
};
