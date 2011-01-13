    var   sys           = require('sys')
        , StreamHandler = require('stream-handler')
    ;
     
    var stream = new StreamHandler('example.com', 110);
    stream.on('line', function(line) {
        console.log('Received Line: ' + line);
    });
    stream.on('error', function (err, excp) {
    	console.log(excp);
    });
    
    //Catch the welcome message
    stream.once('line', function(line) {
    	console.log('Got Welcome: ' + line);
    	//Catch the OK from the USER command
		stream.once('line', function(line) {
			if (line == '+OK') {
				//Catche the OK from the PASS command
				stream.once('line', function(line) {
					console.log('Requesting LIST');
					stream.write('LIST' + "\r\n");
				});
				console.log('Sending Password');
				stream.write('PASS MyPassword' + "\r\n");
			}
		});
		console.log('Logging In');
		stream.write('USER info@example.com' + "\r\n");
    });
