'use strict';
// Module Dependencies
// -------------------
var express     = require('express');
var http        = require('http');
var JWT         = require('./lib/jwtDecoder');
var path        = require('path');
var request     = require('request');
var routes      = require('./routes');
var notifications   = require('./routes/notifications');
var activityCreate   = require('./routes/activityCreate');
var activityUpdate   = require('./routes/activityUpdate');
var activityUtils    = require('./routes/activityUtils');
var pkgjson = require( './package.json' );

var app = express();

// Register configs for the environments where the app functions
// , these can be stored in a separate file using a module like config


var APIKeys = {
    appId           : 'ecad721b-9645-4d52-ba4e-03ad3a03051e',
    clientId        : 'jj7ph4mle7s57o3zm473eyjd',
    clientSecret    : '1p3q9AtQZY2l2Qrp6eC8h4Ka',
    appSignature    : 'oP7qBTgJj5N1deQ4CdaL-SoAKiePVmz7JCWFQQCOGOLhST9B4Ne5vPci_Sb8MGSTrkrc7jSS2zV0XeWA3SIu6IrB6NKyLUcrV5Eg9g37csj7T0bFoL4sy1Vc1nMWi8onXf66DSDFzV2pjAKlwdVROjFUONECTnuB0PaRkImq81Hp785-eJ2UuN7aKka7uvKOQssQsFDqM4afhNOO2hRLWGhn179s2LXN9SW1F4F-JGccoaTAjR_rpYp_iIQxWg2',
    authUrl         : 'https://auth.exacttargetapis.com/v1/requestToken?legacy=1'
};


// Simple custom middleware
function tokenFromJWT( req, res, next ) {
    // Setup the signature for decoding the JWT
    var jwt = new JWT({appSignature: APIKeys.appSignature});
    
    // Object representing the data in the JWT
    var jwtData = jwt.decode( req );

    // Bolt the data we need to make this call onto the session.
    // Since the UI for this app is only used as a management console,
    // we can get away with this. Otherwise, you should use a
    // persistent storage system and manage tokens properly with
    // node-fuel
    req.session.token = jwtData.token;
    next();
}

// Use the cookie-based session  middleware
app.use(express.cookieParser());

// TODO: MaxAge for cookie based on token exp?
app.use(express.cookieSession({secret: "DeskAPI-CookieSecret0980q8w0r8we09r8"}));

// Configure Express
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.favicon());
app.use(app.router);
app.use(express.static(__dirname, 'public'));

// Express in Development Mode
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// HubExchange Routes
app.get('/', routes.index );

app.get('/config.json', routes.configFile);

app.post('/login', tokenFromJWT, routes.login );
app.post('/logout', routes.logout );

// Custom Activity Routes for interacting with Desk.com API
app.post('/ixn/activities/create-case/save/', activityCreate.save );
app.post('/ixn/activities/create-case/validate/', activityCreate.validate );
app.post('/ixn/activities/create-case/publish/', activityCreate.publish );
app.post('/ixn/activities/create-case/execute/', activityCreate.execute );

app.post('/ixn/activities/update-case/save/', activityUpdate.save );
app.post('/ixn/activities/update-case/validate/', activityUpdate.validate );
app.post('/ixn/activities/update-case/publish/', activityUpdate.publish );
app.post('/ixn/activities/update-case/execute/', activityUpdate.execute );

app.post('/notifications', notifications.save );

app.get('/clearList', function( req, res ) {
	// The client makes this request to get the data
	activityUtils.logExecuteData = [];
	res.send( 200 );
});


// Used to populate events which have reached the activity in the interaction we created
app.get('/getActivityData', function( req, res ) {
	// The client makes this request to get the data
	if( !activityUtils.logExecuteData.length ) {
		res.send( 200, {data: null} );
	} else {
		res.send( 200, {data: activityUtils.logExecuteData} );
	}
});

app.get( '/version', function( req, res ) {
	res.setHeader( 'content-type', 'application/json' );
	res.send(200, JSON.stringify( {
		version: pkgjson.version
	} ) );
} );

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
