const express = require("express");
const router = express.Router();
const { postTweet, updateTweet, getMyTweets, delTweet } = require("../controllers/userTweets");
const authenticateUser = require("../controllers/Auth").authenticateUser;

router.post("/postTweet", authenticateUser, postTweet);
router.put("/updateTweet", authenticateUser, updateTweet);
router.get("/getMyTweets", authenticateUser, getMyTweets);
router.delete("/delTweet", authenticateUser, delTweet);
module.exports = router;
