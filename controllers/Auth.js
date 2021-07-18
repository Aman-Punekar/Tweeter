const Profile = require("../models/profile");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_AUTH_TOKEN = process.env.JWT_AUTH_TOKEN;

const genPasswordHash = async (password) => {
  var salt = crypto.randomBytes(32).toString("hex");
  var genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return {
    salt: salt,
    hash: genHash,
  };
};

const validPassword = async (password, hash, salt) => {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash === hashVerify;
};

const isMember = async (data) => {
  try {
    if (data.email) {
      let user = await Profile.findOne(
        { email: data.userId },
        { credentials: 1 }
      );
      if (user) return user;
      return false;
    } else {
      let user = await Profile.findOne(
        { username: data.userId },
        { credentials: 1 }
      );
      if (user) return user;
      return false;
    }
  } catch (err) {
    throw err;
  }
};

const signup = async (req, res) => {
  try {
    let result = await Profile.insertMany({
      email: req.body.email,
      username: req.body.username,
    });

    let credentials = await genPasswordHash(req.body.password);

    await Profile.findOneAndUpdate(
      { username: result[0].username },
      { '$set': { credentials: credentials } }
    );
    return res.status(200).send({ msg: "signup successful" });
  } catch (err) {
    let errMsg = err.writeErrors[0].err.errmsg;
    if (errMsg.includes("email")) {
      return res
        .status(500)
        .send({ msg: "There exists an account with the given email id" });
    } else if (errMsg.includes("username")) {
      return res.status(500).send({ msg: "username is already taken" });
    }

    return res.status(500).send({ msg: "Signup Unsuccesful" });
  }
};

const login = async (req, res) => {
  let data = await isMember(req.body);

  if (!data)
    return res
      .status(500)
      .send({ msg: `no user with given credential ${req.body.userId}` });

  let valid = await validPassword(
    req.body.password,
    data.credentials.hash,
    data.credentials.salt
  );

  if (!valid) return res.status(500).send("Wrong Password");

  const accessToken = jwt.sign(
    {
      id: data._id,
    },
    JWT_AUTH_TOKEN,
    {
      expiresIn: "1d",
    }
  );

  res
    .status(202)
    .cookie("accessToken", accessToken, {
      expires: new Date(new Date().getTime() + 86400 * 1000),
      sameSite: "strict",
      httpOnly: true,
    })

    .cookie("authSession", true, {
      expires: new Date(new Date().getTime() + 86400 * 1000),
      sameSite: "strict",
    })

    .send({
      msg: "Device verified",
    });
};

const authenticateUser = (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  jwt.verify(accessToken, JWT_AUTH_TOKEN, async (err, data) => {
    if (data) {
      req.id = data.id;

      next();
    } else if (err.message === "TokenExpiredError") {
      return res
        .status(403)
        .send({ success: false, msg: "Access Token Expired" });
    } else {
      res.status(403).send({ err, msg: "User Not Authenticated" });
    }
  });
};

const logout = (req, res) => {
  res.clearCookie("accessToken").clearCookie("authSession");

  res.json({
    message: "User signed out successfully",
  });
};

module.exports = { signup, login, logout, authenticateUser };
