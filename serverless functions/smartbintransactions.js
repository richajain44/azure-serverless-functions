//This function is part of Azure IoT Serverless Challenge
//Function records Bins Transactions that are Violations in the database. This function is used when the 
//a Bin Transaction is identified as Violation and saves the data to database.
//The Raspberry Pi sends the Violation details to the Azure serverless function.
//The function then saves them to Azure SQL Database
//Input Paramerters - BinId, Violation, BinTime, BinURL
//BinId - MAC address of the Pi
//Violation - List of violations identifed using the Azure CustomVision 
//BinTime- TimeStamp when the event occured
//BinURL - The URL of the captured image that is uploaded to the Azure Blob Storage 
//Return - Success Message
//URL of the function with sample data : https://smartbintransaction.azurewebsites.net/api/bintransaction?binId=bin145,violation=plastic_bags,CFL,Styrofoam,bintime=08/03/2018@04:31:279PM,binurl=https://smartwasteblob.blob.core.windows.net/recycle/device1122/pic_ca2b52c6-6ae5-4527-a831-6ce3c858b298.jpg

Connection = require('tedious').Connection;
Request = require('tedious').Request;

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function');
    let bId = req.query.binId
    let bviolation = req.query.violation
    let btime =req.query.bintime
    let burl = req.query.binurl

    context.log(bId);
    context.log(bviolation);
    context.log(btime);
    context.log(burl);

    config = {
        userName: 'smartwasteadmin',
        password: '********', //Password of the Azure SQL Server
        server: 'smartwastebin.database.windows.net',
        options: {
            database:'bindb',
            encrypt:true
        }
    };
    if (bId && bviolation && btime && burl) {
        connection = new Connection(config);
        connection.on('connect', function(err){
            context.log('connection done');
           if(err){
                context.log(err);
            }
            else{
                context.log("start execution");
				//SQL command to insert data
                request = new Request("INSERT into Transactions (BinId, Violation, TimeStamp, URL) values (\'" +bId + " \', \' " +bviolation + "\', \'"+btime+"\',\'" +burl+ " \')", (err, rowCount) => {
                    if(err){
                        context.log(err)
                    }else{
                        context.log(rowCount);
                    }
                    connection.close();
                });
               
            }
    
    request.on('requestCompleted', function() {
        context.res = {
            body: "Succsesfully inserted the record with detials: " + (bId) + ","+(bviolation)+","+(btime)+","+(burl) ,
            headers: {
                'Content-Type': 'text/html'
            }
        };
        context.done();
    });
    connection.execSql(request);
    });
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string"
        };
    }
  
};