const Tweet = require("../models/tweets");

const likeTweet = async (req, res) => {
  try {
    await Tweet.findByIdAndUpdate(
      { '_id': req.body.tweetId },
      { '$inc': { "likes.num": 1 } }
    );
    await Tweet.findByIdAndUpdate(
      { '_id': req.body.tweetId },
      { '$push': { "likes.likedBy": req.id } }
    );

    res.status(200).send("message liked successfully");
  } catch (err) {
    res.status(500).send({ msg: "Some error occured" });
  }
};

const dislikeTweet = async (req, res) => {
  try {
    await Tweet.findByIdAndUpdate(
      { '_id': req.body.tweetId },
      { '$inc': { "dislikes.num": 1 } }
    );
    await Tweet.findByIdAndUpdate(
      { '_id': req.body.tweetId },
      { '$push': { "dislikes.dislikedBy": req.id } }
    );

    res.status(200).send("message liked successfully");
  } catch (err) {
    res.status(500).send({ msg: "Some error occured" });
  }
};

const comment = async (req, res) => {
  try {
    await Tweet.updateOne(
      { '_id': req.body.tweetId },
      {
        '$push': {
          comments: {
            comment: req.body.comment,
            commentedBy: req.id,
          },
        },
      }
    );
  } catch (err) {
    res.status(500).send({ msg: "Some error occured" });
  }
};

module.exports = { likeTweet, dislikeTweet, comment };
