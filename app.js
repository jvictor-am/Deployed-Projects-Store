const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const connectDB = require('./config/db');

dotenv.config({
  path: './config/config.env',
});

require('./config/passport')(passport);

connectDB();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const { formatDate, truncate, stripTags, editIcon } = require('./helpers/hbs');

app.engine(
  '.hbs',
  exphbs({
    helpers: { formatDate, truncate, stripTags, editIcon },
    efaultLayout: 'main',
    extname: '.hbs',
  })
);
app.set('view engine', '.hbs');

app.use(
  session({
    secret: 'deploy app',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Set global var

app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/projects', require('./routes/projects'));

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}.`)
);
