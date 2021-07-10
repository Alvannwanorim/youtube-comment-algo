const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db");
const userRouter = require("./routes/userRoutes");
dotenv.config();

const app = express();

//Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());

///routes
app.get("/", (req, res) => {
  res.send("<h1>Welcome to The Best  media blog</h1>");
});

// User routes
app.use("/api/users/auth", userRouter);
//connect to Database
connectDB();

//listen too server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server runnign on PORT: ${PORT}`));
