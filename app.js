const path = require('path');
const join = require('path').join;
const winston = require('winston');
const express = require('express');
const favicon = require('serve-favicon');
const serveStatic = require('serve-static');
const sassMiddleware = require('node-sass-middleware');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const expressLogging= require('express-logging');

var port = process.env.PORT || 8282;
var app = express();

winston.level = 'debug';

app.use('/css', sassMiddleware({
	src: path.join(__dirname, 'public/scss'),
	dest: path.join(__dirname, 'public/css'),
	debug: true,
	outputStyle: 'compressed',
	outputStyle: 'expanded',
	log: function (severity, key, value) { winston.log(severity, 'node-sass-middleware   %s : %s', key, value); }
}));

// app.set( 'port', (process.env.PORT || port) );
app.set( 'env', 'development' );
// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');
app.use( expressLogging(winston) ) ;
app.use( bodyParser.json({limit: '50mb'}) );
app.use( bodyParser.urlencoded({ extended: false,limit: '50mb', parameterLimit:50000 }) );
app.use( favicon('public/favicon.ico') );
app.use( express.static(__dirname + '/bower_components') );
app.use( express.static(__dirname + '/public') );
app.listen(port);
winston.log('info', `Server started on port ${port}`);
