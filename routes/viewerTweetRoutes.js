const express = require('express');
const router = express.Router();
const {likeTweet, dislikeTweet, comment} = require("../controllers/viewerTweet");
const authenticateUser = require("../controllers/Auth").authenticateUser;

router.post("/likeTweet", authenticateUser, likeTweet);
router.post("/dislikeTweet", authenticateUser, dislikeTweet);
router.posot("/comment", authenticateUser, comment)


module.exports = router;
