//This function is part of Azure IoT Serverless Challenge
//Function to set the Configuration detials when the system is installed for the first time. 
//This function is used to set the different violation types for the given business use case. For example, cardbaord can be
//violation for some business use case while for other it may not be. This function helps setting that in the Raspberry PI.
//The Function is triggered through the WebApp, the Admin will set these parameters, the function then sends these input parameters
//to the Azure Service Bus Queue as a message, which then triggers another function that sends this message to Azue IOT Hub,
//the IoT Hub sends the message to the IoT Edge Devices.
//The WebApp triggers the Azure serverless function with the input parameters 
//The function then sends these parameters to the IoT Edge Devices
//Input Paramerter - recyclable
//Return - Message with the list of parameters

//URL of the function with sample data : https://smartconfiguration.azurewebsites.net/api/configuration?recyclable=cardboard,egg_shell

const Connection = require('tedious').Connection;
const Request = require('tedious').Request;

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function');
    
    let rec = req.query.recyclable

    context.log(rec);
    const config = {
        userName: 'smartwasteadmin',
        password: '*********',
        server: 'smartwastebin.database.windows.net',
        options: {
            database:'bindb',
            encrypt: true
        }
    };
    if (rec) {
        context.log('config done');
        const connection = new Connection(config);
        connection.on('connect', err => {
            if (err){
                context.log("connection error");
                context.log(err)
            }else{
                context.log('connection done');
				//SQL Command to insert the values in the SQL Database
                const request = new Request("INSERT into Config (Recyclable) values (\'" +rec + " \')", (err, rowCount) => {
                    context.log('inside exe');
                    if(err){
                        context.log(err);
                        }
                    else{
                        context.log(rowCount);
                        }
                    connection.close();
                });
            
            context.log('executed statement');
            connection.execSql(request); 
        } 
        }); 

        var messageString = "Recyclable: " + rec;
        context.log(messageString);
		//code to send the message to the service bus queue
        context.bindings.outputSbMsg =messageString;
        context.res = {
            body: "Succsesfully inserted: " + (rec),
            headers: {
                    'Content-Type': 'text/html'
                }
            };
        context.done(); 
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string"
        };
        context.done();
    }
};