//This function is part of Azure IoT Serverless Challenge
//Function to create Bins in the database. This function is used when the 
//a new Bin is installed for the first time
//The Raspberry Pi sends the Bin details to the Azure serverless function. 
//The function then saves them to Azure SQL Database
//Input Paramerters - BinId, BinLatitute, BinLongitude, BinType
//BinId - MAC address of the Pi
//BinLatitute and BinLongitude - obtianed using GEO Location API
//BinType- Compost or Organic
//Return - Success Message
//URL of the function with sample data : https://smartwastebincreation.azurewebsites.net/api/insertrecord?binId=bin145,bLatitude=47.624663,bLongitude=-122.340654,bincat=organic


const Connection = require('tedious').Connection;
const Request = require('tedious').Request;

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function');
    
	//Bin Details
    let bId = req.query.binId
    let bLat = req.query.bLatitude
    let bLon =req.query.bLongitude
    let btype =req.query.bincat

    context.log(bId);
    context.log(bLat);
    context.log(bLon);
    context.log(btype);

    const config = {
        userName: 'smartwasteadmin', 
        password: '********',//password of the actual database
        server: 'smartwastebin.database.windows.net',
        options: {
            database: 'bindb',
            encrypt: true
        }
    };
   
    if (bId!="" && btype!="" && bLat!="" && bLon!="") {
        const connection = new Connection(config);
        connection.on('connect', err => {
            if(err){
                context.log(err)
            }else{
                context.log('connection done');
				//SQL statement to insert data
                const request = new Request("INSERT into Bins (BinId, BinLat, BinLon, BinType) values (\'" +bId + " \', \' " +bLat + "\',\'"+bLon+"\', \'"+btype+"\')", function(err, rowCount){
                //check for duplicate key error
				if (err){
                        context.log("duplicate key");
                        context.res = {
                            body: "Error: Duplicate Primary Key",
                            headers: {'Content-Type': 'text/html'}
                        }; 
                        context.done();
                }else{
                        context.log(rowCount);
                    }   
                        connection.close();
                });
				//return success message
                request.on('requestCompleted',function(){
                    context.res = {
                            body: "Succsesfully created a new bin: " + (bId) + ","+(bLat)+","+(bLon)+","+(btype) ,
                            headers: {
                                    'Content-Type': 'text/html'
                            }
                        };
                        context.done();

                });
                connection.execSql(request);
            }
        });
    }

    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string"
        };
        context.done();
    }   
};