'use strict';
var https = require( 'https' );
var activityUtils = require('./activityUtils');


/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    activityUtils.logData( req );
    res.send( 200, 'Edit' );
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    activityUtils.logData( req );
    res.send( 200, 'Save' );
};

/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    activityUtils.logData( req );
    res.send( 200, 'Publish' );
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    activityUtils.logData( req );
    res.send( 200, 'Validate' );
};

/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    activityUtils.logData( req );

    //merge the array of objects.
    var aArgs = req.body.inArguments;
    var oArgs = {};
    for (var i=0; i<aArgs.length; i++) {
        for (var key in aArgs[i]) {
            oArgs[key] = aArgs[i][key];
        }
    }

    var email = oArgs.emailAddress;
    var fname = oArgs.firstName;
    var lname = oArgs.lastName;

    var post_data = JSON.stringify({
        "name": email
    });
    var options = {
        'hostname':'kvader-developer-edition.na24.force.com'
        ,'path': '/services/apexrest/Tokenized'
        ,'method': 'POST'
        ,'headers': {
            'Accept': 'application/json'
            ,'Content-Type': 'application/json'
            ,'Content-Length': post_data.length
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
                console.log('Resultado',data);
                
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
    res.send( 200, {"result":"ok"});   
    
};
