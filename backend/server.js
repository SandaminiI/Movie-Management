import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import movieCategoryRoutes from './routes/movieCategoryRoutes.js'
import movieRoutes from './routes/movieRoutes.js'
import movieScheduleRoutes from "./routes/movieScheduleRoutes.js";
import cors from "cors";

//configure env
dotenv.config();

//database config
connectDB();
//rest object
const app = express();

//middlewears
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/v1/moviecategory",movieCategoryRoutes);
app.use("/api/v1/movies",movieRoutes);
app.use("/api/v1/movieschedule",movieScheduleRoutes )

//rest api
app.get("/", (req, res) => {
  res.send("<h1>Welcome to leisurehub</h1>");
});

//PORT
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
  console.log(
    `Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
      .white
  );
});
