const path = require("path");
const fs = require("fs");

// local dev helper
const envLocalJson = path.join(__dirname, ".env.local.json");
try {
  const ceEnv = fs.readFileSync(envLocalJson).toString("utf-8");
  if (ceEnv) process.env.CE_SERVICES = ceEnv;
} catch (error) {
  debug(`${envLocalJson} not found`, error);
}

const createError = require("http-errors");
const express = require("express");
const logger = require("morgan");
const debug = require("debug")("services:server");
const indexRouter = require("./routes/index");
const analyticsRouter = require("./routes/analytics");
const convertRouter = require("./routes/convert");

const converted = path.join(__dirname, "routes/converted");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

if (process.env.NODE_ENV === "production") app.use(logger("combined"));
else app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/converted", express.static(converted));

app.use("/", indexRouter);
app.use("/analytics", analyticsRouter);
app.use("/convert", convertRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
