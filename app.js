const fs = require('fs');
const path = require('path');
const join = require('path').join;
const express = require('express');
const favicon = require('serve-favicon');
const sassMiddleware = require('node-sass-middleware');
const bodyParser = require('body-parser');
const expressLogging = require('express-logging');

// logger
const winston = require('winston');
const logDir = 'log';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const moment = () => (new Date()).toLocaleTimeString();
const myConsoleFormat = winston.format.printf(function (info) {
	return `${info.level}[${moment()}]: ${info.message} `;
});
const logger = winston.createLogger({
	transports: [
		new (winston.transports.Console)({ 
			format: winston.format
				.combine( winston.format.colorize(), myConsoleFormat),
			humanReadableUnhandledException: true,
			level: 'info'
		}),
		new (winston.transports.File)({
			filename: `${logDir}/debug.log`,
			timestamp: moment,
			level: 'debug'
		})
	]
});
const port = process.env.PORT || 1422;
const app = express();
const db = require('./components/db');

require('./routes')(app, db);

// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');
app.set( 'port', (process.env.PORT || port) );
app.set( 'env', 'development' );
app.use('/css', sassMiddleware({
	src: path.join(__dirname, 'public/scss'),
	dest: path.join(__dirname, 'public/css'),
	debug: true,
	outputStyle: 'compressed',
	log: function (severity, key, value) { winston.log(severity, 'node-sass-middleware   %s : %s', key, value); }
}));
app.use( expressLogging(logger) ) ;
app.use( bodyParser.json({limit: '50mb'}) );
app.use( bodyParser.urlencoded({ extended: true,limit: '50mb', parameterLimit:50000 }) );
app.use( favicon('public/favicon.ico') );
app.use( express.static(__dirname + '/bower_components') );
app.use( express.static(__dirname + '/public') );
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  logger.info(req);
  next();
});
app.listen(port, () => {
	logger.info('We are live on ' + port);
}); 
