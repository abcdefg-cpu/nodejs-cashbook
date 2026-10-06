const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/web/index');
const accountRouter = require('./routes/web/account')
const authRouter = require('./routes/web/auth')
const accountApiRouter = require('./routes/api/accounts')
const authApiRouter = require('./routes/api/auth')

const session = require('express-session')
const mongoStore = require('connect-mongo')
const { DB_HOST, DB_PORT, DB_DATABASE } = require('./config/index')

const app = express();

app.use(session({
  name: 'sid',
  secret: 'admin123',
  saveUninitialized: false,
  resave: false,
  store: mongoStore.create({
    mongoUrl: `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`
  }),
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7天
  }
}))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/account', accountRouter);
app.use('/api', accountApiRouter)
app.use('/api', authApiRouter)


// 404 错误
app.use(function (req, res, next) {
  res.status(404).json({
    code: '1002',
    msg: '接口不存在！',
    data: null
  });
  res.render('404')
});

// 全局错误处理
app.use(function (err, req, res, next) {
  // res.locals是全局模板变量，模板里（比如ejs）中可以直接使用
  res.locals.message = err.message;
  // 只有开发环境才提供把完整错误对象传递给模板
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
