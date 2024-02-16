var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

var http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: [{
        origin: "http://localhost",
        methods: ["GET", "POST"]
    },
    {
        origin: "https://company-expo.com",
        methods: ["GET", "POST"]
    }]
});
// (3030, {
//     cors: [{
//         origin: "http://localhost",
//         methods: ["GET", "POST"]
//     },
//         {
//             origin: "https://company-expo.com",
//             methods: ["GET", "POST"]
//         }]
// });
const PORT = process.env.PORT || 3030;

let userSockets = {};
io.on('connection', (socket) => {
    console.log(socket.id);
    socket.on('register', (userId) => {
        userSockets[userId] = socket.id;
        console.log(userSockets);
    });
    socket.on('link', (obj) => {
        console.log(obj);
        let targetSocket = userSockets[obj.id];
        io.to(targetSocket).emit('linkTo' + obj.id, 'Admission granted');
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
        Object.keys(userSockets).forEach((key) => {
            if (userSockets[key] === socket.id) {
                delete userSockets[key];
            }
        });
    });
});

http.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});

module.exports = app;
