require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 8000


if(process.env.NODE_ENV=="production"){
  db = process.env.MONGOURL;
}else{
  db = process.env.DATABASE;
}

//routes
const authRoutes = require("./routes/authRoutes");
const userTweetRoutes = require("./routes/userTweetsRoutes");
const viewerTweetRoutes = require("./routes/viewerTweetRoutes");


//connecting to the server
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connection is successful");
  })
  .catch((err) => console.log("Connection is unsuccessful"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("",authRoutes);
app.use("",userTweetRoutes);
app.use("", viewerTweetRoutes);



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});