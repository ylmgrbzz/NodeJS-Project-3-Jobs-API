require("dotenv").config();
require("express-async-errors");

const helmet = require("helmet");
const cors = require("cors");
const rateLimiter = require("express-rate-limit");

const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const YAML = require("yamljs");

const express = require("express");
const app = express();

const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");

const { authenticateUser } = require("./middleware/authenticate-user");
const connectDB = require("./db/connect");

const { errorHandlerMiddleware } = require("./middleware/error-handler");
const { notFoundMiddleware } = require("./middleware/not-found");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 60 * 1000,
    max: 60,
  })
);

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.get("/", (req, res) => {
  res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>');
});

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
