'use strict';
var https = require( 'https' );
var activityUtils = require('./activityUtils');


/*
 * POST Handler for / route of Notification (this is the edit route).
 */
exports.edit = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    activityUtils.logData( req );
    res.send( 200, 'Edit' );
};

/*
 * POST Handler for /save/ route of Notification.
 */
exports.save = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    activityUtils.logData( req );
	initNotification(req,res);
};

/*
 * POST Handler for /publish/ route of Notification.
 */
exports.publish = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    activityUtils.logData( req );
    res.send( 200, 'Publish' );
};

/*
 * POST Handler for /validate/ route of Notification.
 */
exports.validate = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    activityUtils.logData( req );
    res.send( 200, 'Validate' );
};

/*
 * POST Handler for /execute/ route of Notification.
 */
exports.execute = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    activityUtils.logData( req );

	//initCase(req,res);
};


function initNotification(req,res) {
	console.log(req);
	var allowedParams = ['idUser', 'idCampana', 'mensaje', 'idMensaje', 'listParameters']

	var idUser = req.body.idUser;
	var idCampana = req.body.idCampana;
	var mensaje = req.body.mensaje;
	var idMensaje = req.body.idMensaje;
	var listParameters = req.body.listParameters;
	
	console.log(idCampana);
	
	if (idUser && idCampana && mensaje && idMensaje && listParameters ) {
			res.send( 201, JSON.stringify({ 'exitoso': true }) );
		}
	else {
		res.send( 500, {message: 'Parameters are incompleted.'} );
	}
};


function findCustIdByEmail(email, next) {
	console.log('findCustIdByEmail', email);
	var post_data = '';				
	var options = {
		'hostname': activityUtils.deskCreds.host
		,'path': '/api/v2/customers/search?email=' + email 
		,'method': 'GET'
		,'headers': {
			'Accept': 'application/json' 
			,'Content-Type': 'application/json'
			,'Content-Length': post_data.length
			,'Authorization': 'Basic ' + activityUtils.deskCreds.token
		},
	};
	
	var httpsCall = https.request(options, function(response) {
		var data = ''
			,redirect = ''
			,error = ''
			;
		response.on( 'data' , function( chunk ) {
			data += chunk;
		} );				
		response.on( 'end' , function() {
			if (response.statusCode == 200) {
				data = JSON.parse(data);
				console.log('onEND findCustIdByEmail',response.statusCode, 'found count:',data.total_entries);
				if (data.total_entries > 0) {
					next(response.statusCode, 'findCustIdByEmail', {id: data._embedded.entries[0].id});
				} else {
					next( response.statusCode, 'findCustIdByEmail', {} );
				}					
			} else {
				next( response.statusCode, 'findCustIdByEmail', {} );
			}
		});								

	});
	httpsCall.on( 'error', function( e ) {
		console.error(e);
		next(500, 'findCustIdByEmail', {}, { error: e });
	});				
	
	httpsCall.write(post_data);
	httpsCall.end();
};


function createCustomer(data, next) {
	console.log('createCustomer', data.fname, data.lname);
	var post_data = JSON.stringify({  
		"first_name":data.fname
		,"last_name":data.lname
		,"emails": [
			{
				"type": "other",
				"value": data.email
			}
    	]
	});			
		
	var options = {
		'hostname': activityUtils.deskCreds.host
		,'path': '/api/v2/customers'
		,'method': 'POST'
		,'headers': {
			'Accept': 'application/json' 
			,'Content-Type': 'application/json'
			,'Content-Length': post_data.length
			,'Authorization': 'Basic ' + activityUtils.deskCreds.token
		},
	};				
	
	var httpsCall = https.request(options, function(response) {
		var data = ''
			,redirect = ''
			,error = ''
			;
		response.on( 'data' , function( chunk ) {
			data += chunk;
		} );				
		response.on( 'end' , function() {
			if (response.statusCode == 201) {
				data = JSON.parse(data);
				console.log('onEND createCustomer',response.statusCode,data.id);
				if (data.id) {
					next(response.statusCode, 'createCustomer', {id: data.id});
				} else {
					next( response.statusCode, 'createCustomer', {} );
				}
			} else {
				next( response.statusCode, 'createCustomer', {} );
			}				
		});								

	});
	httpsCall.on( 'error', function( e ) {
		console.error(e);
		next(500, 'createCustomer', {}, { error: e });
	});				
	
	httpsCall.write(post_data);
	httpsCall.end();
};


function createCase(custId, email, priority, next) {
	console.log('createCase', custId);
	var post_data = JSON.stringify({  
		"type":"email",
		"subject":"Email Case From JB for " + email,
		"priority":priority,
		"status":"open",
		"labels": ["JB"],
		"message":{  
			"direction": "in",
			"to": activityUtils.deskCreds.supportEmail,
			"from": email,
			"body": "This is a new case created for a customer coming from Journey Builder.",
			"subject": "My email subject"
		}
	});			
		
	var options = {
		'hostname': activityUtils.deskCreds.host
		,'path': '/api/v2/customers/' + custId + '/cases'
		,'method': 'POST'
		,'headers': {
			'Accept': 'application/json' 
			,'Content-Type': 'application/json'
			,'Content-Length': post_data.length
			,'Authorization': 'Basic ' + activityUtils.deskCreds.token
		},
	};				
	
	var httpsCall = https.request(options, function(response) {
		var data = ''
			,redirect = ''
			,error = ''
			;
		response.on( 'data' , function( chunk ) {
			data += chunk;
		} );				
		response.on( 'end' , function() {
			if (response.statusCode == 201) {
				data = JSON.parse(data);
				console.log('onEND createCase',response.statusCode,data.id);			
				next(response.statusCode, 'createCase', {id: data.id});
			} else {
				next( response.statusCode, 'createCase', {} );
			}				
		});								

	});
	httpsCall.on( 'error', function( e ) {
		console.error(e);
		next(500, 'createCase', {}, { error: e });
	});				
	
	httpsCall.write(post_data);
	httpsCall.end();

};

