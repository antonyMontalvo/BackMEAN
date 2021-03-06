/**
 * Modules
 */
const morgan = require("morgan"),
  chalk = require("chalk"),
  path = require("path"),
  cors = require("cors"),
  compression = require('compression'),
  expbhs = require('express-handlebars'),
  express = require("express"),
  app = express();

/**
 * Settings
 */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config(); // variables de entorno
}

const HOST = process.env.APP_HOST || '0.0.0.0',
  routes = require("./routes/index"),
  io = require('./services/socket')(app),
  { mongoose } = require("./config/database");

app.set("port", (process.env.APP_PORT || process.env.PORT || 3000));
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', expbhs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs'
}));

/**
 * Middlewares
 */
app.use(morgan("dev")); // permite que las peticiones se vean en la consola
app.use(express.json()); // reemplaza a body-parser
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(cors());

/**
 * Global variables
 */
app.use((req, res, next) => {
  next();
});

/**
 * routes
 */
routes.getRoutes(app);

/**
 * Public files
 */
app.use(express.static(path.join(__dirname + '/public')));

/**
 * Start server
 */
io.listen(app.get("port"), HOST, () => {
  process.env.NODE_ENV !== 'production'
    ? console.log(chalk.bgGreen.black(`Server start on:`) + ' ' + `http://${HOST}:${app.get("port")}`)
    : console.log(chalk.bgGreen.black(`Server start`));
});

module.exports = app;
