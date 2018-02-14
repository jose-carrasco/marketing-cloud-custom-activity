define( function( require ) {

    'use strict';
    
	var Postmonger = require( 'postmonger' );
	var $ = require( 'vendor/jquery.min' );

    var connection = new Postmonger.Session();
    var toJbPayload = {};
    var step = 1; 
	var tokens;
	var endpoints;
	
    $(window).ready(onRender);

    connection.on('initActivity', function(payload) {
        var channel;
        var idUser;
        var idCampana;
        var idMensaje;
        var mensaje;
        var listParameters;

        if (payload) {
            toJbPayload = payload;
            console.log('payload',payload);
            
			//merge the array of objects.
			var aArgs = toJbPayload['arguments'].execute.inArguments;
			var oArgs = {};
			for (var i=0; i<aArgs.length; i++) {  
				for (var key in aArgs[i]) { 
					oArgs[key] = aArgs[i][key]; 
				}
			}
			//oArgs.priority will contain a value if this activity has already been configured:
            channel = oArgs.channel || toJbPayload['configurationArguments'].defaults.channel;
            idUser = oArgs.idUser;
            idCampana = oArgs.idCampana;
            idMensaje = oArgs.idMensaje;
            mensaje = oArgs.mensaje;
            listParameters = oArgs.listParameters;
        }
        
		$.get( "/version", function( data ) {
			$('#version').html('Version: ' + data.version);
		});                

        // If there is no priority selected, disable the next button
        if (!channel) {
            connection.trigger('updateButton', { button: 'next', enabled: false });
        }


        $('#selectChannel').find('option[value='+ channel +']').attr('selected', 'selected');
		gotoStep(step);
        
    });

    connection.on('requestedTokens', function(data) {
		if( data.error ) {
			console.error( data.error );
		} else {
			tokens = data;
		}        
    });

    connection.on('requestedEndpoints', function(data) {
		if( data.error ) {
			console.error( data.error );
		} else {
			endpoints = data;
		}        
    });

    connection.on('clickedNext', function() {
        step++;
        gotoStep(step);
        connection.trigger('ready');
    });

    connection.on('clickedBack', function() {
        step--;
        gotoStep(step);
        connection.trigger('ready');
    });

    function onRender() {
        connection.trigger('ready');

        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');

        // Disable the next button if a value isn't selected
        $('#selectChannel').change(function() {
            var channel = getChannel();
            connection.trigger('updateButton', { button: 'next', enabled: Boolean(channel)});
        });
    };

    function gotoStep(step) {
        $('.step').hide();
        switch(step) {
            case 1:
                $('#step1').show();
                connection.trigger('updateButton', { button: 'next', text: 'next', enabled: Boolean(getChannel()) });
                connection.trigger('updateButton', { button: 'back', visible: false });
                break;
            case 2:
                $('#step2').show();
                $('#showPriority').html(getChannel());
                connection.trigger('updateButton', { button: 'back', visible: true });
                connection.trigger('updateButton', { button: 'next', text: 'done', visible: true });
                break;
            case 3: // Only 2 steps, so the equivalent of 'done' - send off the payload
                save();
                break;
        }
    };

    function getChannel() {
        return $('#selectChannel').find('option:selected').attr('value').trim();
    };

    function getIdUser() {
        return $('#idUser').val();
    };

    function getidCampana() {
        return $('#idCampana').val();
    };

    function getidMensaje() {
        return $('#idMensaje').val();
    };

    function getMensaje() {
        return $('#mensaje').val();
    };

    function getListParameters() {
        return $('#listParameters').val();
    };
	
    function save() {

        var value = getChannel();

        // toJbPayload is initialized on populateFields above.  Journey Builder sends an initial payload with defaults
        // set by this activity's config.json file.  Any property may be overridden as desired.
        //toJbPayload.name = "my activity";

		//this will be sent into the custom activity body within the inArguments array.
        toJbPayload['arguments'].execute.inArguments.push({"priority": value});
        toJbPayload['arguments'].execute.inArguments.push({"idUser": getIdUser()});
        toJbPayload['arguments'].execute.inArguments.push({"idCampana": getidCampana()});
        toJbPayload['arguments'].execute.inArguments.push({"idMensaje": getidMensaje()});
        toJbPayload['arguments'].execute.inArguments.push({"mensaje": getMensaje()});
        toJbPayload['arguments'].execute.inArguments.push({"listParameters": getListParameters()});

		/*
        toJbPayload['metaData'].things = 'stuff';
        toJbPayload['metaData'].icon = 'path/to/icon/set/from/iframe/icon.png';
        toJbPayload['configurationArguments'].version = '1.1'; // optional - for 3rd party to track their customActivity.js version
        toJbPayload['configurationArguments'].partnerActivityId = '49198498';
        toJbPayload['configurationArguments'].myConfiguration = 'configuration coming from iframe';
		*/
		
		toJbPayload.metaData.isConfigured = true;  //this is required by JB to set the activity as Configured.
        connection.trigger('updateActivity', toJbPayload);
    }; 
    	 
});
