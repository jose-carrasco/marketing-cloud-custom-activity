'use strict';
var fs = require('fs');

// Deps
var activityUtils = require('./activityUtils');
var activityCreate = require('./activityCreate');
var activityUpdate = require('./activityUpdate');

/*
 * GET home page.
 */
exports.index = function(req, res){
    if( !req.session.token ) {
        res.render( 'index', {
            title: 'Unauthenticated',
            errorMessage: 'This app may only be loaded via the ExactTarget Marketing Cloud',
        });
    } else {
        res.render( 'index', {
            title: 'Journey Builder Activity Example: Desk.com API',
            results: activityUtils.logExecuteData,
        });
    }
};

exports.login = function( req, res ) {
    console.log( 'req.body: ', req.body );
    res.redirect( '/' );
};

exports.logout = function( req, res ) {
    req.session.token = '';
};


/*
 * Exports config file
*/

/*
 * GET config file.
 */
exports.configFile = function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
    "workflowApiVersion": "1.0",
    "metaData": {
        "version": "2.0",
        "icon": "images/jb-icon.jpg",
        "iconSmall": "images/jb-icon.jpg"
    },
    "type": "REST",
    "lang": {
        "en-US": {
            "name": "Actividad para enviar SMS",
            "description": "Actividad para enviar un SMS a través de TIBCO"
        }
    },
    "arguments": {
        "execute": {       
			"inArguments":[
				{ "emailAddress": "{{Contact.Default.Email}}"}							
			],
            "outArguments": [
            	{ "result":"" }
			],			
			"url": "https://marketing-cloud-ws-dev.herokuapp.com/ixn/activities/smsActivity/execute/",
            "verb": "POST",
            "body": "",
            "header": "",
            "format": "json",
            "useJwt": false,
            "timeout": 10000
        }
    },
    "configurationArguments": {
    	"applicationExtensionKey": "smsActivity",
        "defaults": { "priority": "4"},             
        "save": {
        	"url": "https://marketing-cloud-ws-dev.herokuapp.com/ixn/activities/smsActivity/save/",
            "body": "",
            "verb": "POST",
            "useJwt": false
        },
        "publish": {
        	"url": "https://marketing-cloud-ws-dev.herokuapp.com/ixn/activities/smsActivity/publish/",
            "verb": "POST",
            "body": "",
            "useJwt": false
        },
        "validate": {
        	"url": "https://marketing-cloud-ws-dev.herokuapp.com/ixn/activities/smsActivity/validate/",
            "verb": "POST",
            "body": "",
            "useJwt": false            
        }
    },
    "edit": {
    	"url": "https://marketing-cloud-ws-dev.herokuapp.com/ixn/activities/smsActivity/",
        "height": 400,
        "width": 500
    }
}
	));
};

function readJSONFile(filename, callback) {
  fs.readFile(filename, function (err, data) {
    if(err) {
      callback(err);
      return;
    }
    try {
      callback(null, JSON.parse(data));
    } catch(exception) {
      callback(exception);
    }
  });
}