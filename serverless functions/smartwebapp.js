//This function is part of Azure IoT Serverless Challenge
//Function fetches all the Bins detials from the database to be displayed on the WebApp. 
//The WebApp sends the triggers the Azure serverless function.
//The function then fetches all the Bin Detials  from the Azure SQL Database
//Return - BinId, BinLatitute,BinLongitude,BinType
//URL of the function with sample data : https://smartwebmapapp.azurewebsites.net/api/webmapapp?status=start

Connection = require('tedious').Connection;
Request = require('tedious').Request;
var resLat=''
var resLon=''
var resBinId=''
var resbinType=''
var res=''
module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function');
    var ipadd=[];

    let s = req.query.status
    context.log(s);
    config = {
        userName: 'smartwasteadmin',
        password: '******',
        server: 'smartwastebin.database.windows.net',
        options: {
            database:'bindb',
            encrypt: true
        }
    };
    
    if (s) {
        connection = new Connection(config);
        connection.on('connect',function(err){
            context.log('connection done');
			//SQL Command to fetch all the details
            request = new Request("SELECT Bins.BinId, Bins.BinLat,Bins.BinLon,Bins.BinType FROM Bins", (err, rows) => {
                context.log('inside exe');
                if (err) {
                    context.log(err);
                } else {         
                    context.log('rows: ' + rows);
                }

                connection.close();

            }); 
			//for each row, add the detials to a dictionary and then add them to a final list
            request.on('row', function (columns) {
                context.log('inside columns');
                var row={};                
                columns.forEach(function(column){
                    row[column.metadata.colName]=column.value;
                });

                ipadd.push(row);

            });

            request.on('requestCompleted', function() {
                context.res = {               
                    body: JSON.stringify(ipadd),
                    headers: {'Content-Type': 'text/html'}
                }
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
        context.done();
    }
};