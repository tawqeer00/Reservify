var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require("dotenv").config()
const connectDb = require("./config/db")
const cors = require("cors")
// var reqSanitizer = require('req-sanitizer');

var indexRouter = require('./routes/index');
var usersRouter = require("./routes/users")
var bookingsRouter = require("./routes/bookings")
var adminRouter = require("./routes/admin")
var guardRouter = require("./routes/guard")

connectDb()

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(reqSanitizer());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use("/api/users", usersRouter)
app.use("/api/bookings/", bookingsRouter)
app.use("/api/admin/", adminRouter)
app.use("/api/guard/", guardRouter)

app.use("/api/users/register", usersRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
