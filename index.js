const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
// routes
const userRoute = require("./routes/userRouter");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/postRouter");

dotenv.config();

mongoose.connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
      console.log("Connected to MongoDB");
    }
  );
 
  //middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("common"));
app.get('/', function(req, res) {
  res.send('App deployed to production');
})   
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log("Backend server is running!");
});