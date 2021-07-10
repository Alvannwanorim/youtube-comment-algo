const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  //Get token from header
  const token = req.header("x-auth-token");

  //check if token exists
  if (!token) {
    return res.status(400).json({
      statusCode: 400,
      message: "Anthentication denied, token not found",
    });
  }
  //verify token
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  //return error if token is not valid
  if (!decoded) {
    return res.status(400).json({
      statusCode: 400,
      message: "Anthentication failed, User not authorized",
    });
  }
  //assign token to request body
  req.user = decoded.user;
  next();
};
