const Tweet = require("../models/tweets");
const Profile = require("../models/profile");

const isUserTweet = async (userId, tweetId) => {
  try {
    let result = await Profile.findOne(
      { '$and': [{ '_id': userId }, { tweets: tweetId }] },
      { '_id': 1 }
    );
    if (result) return true;
    return false;
  } catch (err) {
    throw err;
  }
};

const postTweet = async (req, res) => {
  try {
    let result = await Tweet.insertMany(req.body);
    await Profile.findByIdAndUpdate(
      { '_id': req.id },
      { '$push': { tweets: result[0]._id } }
    );
    res.status(200).send({ msg: "tweet uploaded successfully" });
  } catch (err) {
    res.status(500).send({ msg: "Some error occured" });
  }
};

const updateTweet = async (req, res) => {
  try {
    if (!(await isUserTweet(req.id, req.body.tweetId)))
      return res.status(500).send({ msg: "unauthorised action" });
    await Tweet.updateOne(
      { '_id': req.body.tweetId },
      { '$set': { tweet: req.body.tweet } }
    );
    return res.status(200).send({ msg: "tweet modified successfully" });
  } catch (err) {
    res.status(500).send({ msg: "Some error occured" });
  }
};

const getMyTweets = async (req, res) => {
  try {
    let tweetIds = await Profile.findOne(
      { '_id': req.id },
      { tweets: 1, _id: 0 }
    );
    let tweets = await Tweet.find({ _id: { '$in': tweetIds.tweets } });
    res.status(200).send(tweets);
  } catch (err) {
    res.status(500).send({ msg: "Some error occured" });
  }
};

const delTweet = async (req, res) => {
  try {
    if (!(await isUserTweet(req.id, req.body.tweetId)))
      return res.status(500).send({ msg: "unauthorised action" });
    await Profile.updateOne(
      { '_id': req.id },
      { '$pull': { tweets: req.body.tweetId } }
    );
    await Tweet.findByIdAndDelete({ _id: req.body.tweetId });
    return res.status(200).send({ msg: "tweet deleted successfully" });
  } catch (err) {
    res.status(500).send({ msg: "Some error occured" });
  }
};

module.exports = { postTweet, updateTweet, getMyTweets, delTweet };
