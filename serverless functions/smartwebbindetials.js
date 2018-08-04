//This function is part of Azure IoT Serverless Challenge
//Function to fetch each Bin's detials displayed on WebApp. This function is used when the 
//a movse over event occurs on a particular Bin on the WebApp. It fetches all detials related to that Bin.
//The WebApp triggers the Azure serverless function. 
//The function then fetches the data from Azure SQL Database
//Input Paramerters - BinId
//BinId - MAC address of the Pi
//Return - BinType, Total Number of Violations as per Violation Type
//URL of the function with sample data : https://smartwebmap.azurewebsites.net/api/webmap?binid=bin145

Connection = require('tedious').Connection;
Request = require('tedious').Request;

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function');
    var ipadd=[];

    let bId = req.query.binid
    context.log(bId);
    config = {
        userName: 'smartwasteadmin',
        password: '*********',
        server: 'smartwastebin.database.windows.net',
        options: {
            database: 'bindb',
            encrypt: true
        }
    };
    connection = new Connection(config);
    context.log('config done');
    if (bId) {
         connection.on('connect',function(err){
             context.log('connection done');
			 //SQL Command to fetch BinType and Total Number of Violation as per Violation Type
                request = new Request("SELECT * FROM (SELECT BinType FROM Bins WHERE BinId = '" + bId + "') BT CROSS JOIN (SELECT 'cfl' AS Types, COUNT(*) AS Count FROM Transactions WHERE BinId = '" + bId + "' AND Violation LIKE '%cfl%' UNION ALL SELECT 'plastic_bags' AS Types, COUNT(*) AS Count FROM Transactions WHERE BinId = '" + bId + "' AND Violation LIKE '%plastic_bags%' UNION ALL SELECT 'styrofoam' AS Types, COUNT(*) AS Count FROM Transactions WHERE BinId = '" + bId + "' AND Violation LIKE '%styrofoam%' UNION ALL SELECT 'egg_shell' AS Types, COUNT(*) AS Count FROM Transactions WHERE BinId = '" + bId + "' AND Violation LIKE '%egg_shell%' UNION ALL SELECT 'cardboard' AS Types, COUNT(*) AS Count FROM Transactions WHERE BinId = '" + bId + "' AND Violation LIKE '%cardboard%') VT", (err, rows) => {

                    if (err) {
                    context.log(err);
                    } else {
                    context.log('rows: ' + rows);

                    }
                    connection.close();

                }); 
           
            request.on('row', function (columns) {
                context.log('inside columns');
                var rw={};

                columns.forEach(function(column){
                    rw[column.metadata.colName]=column.value;
                });
                ipadd.push(rw);



            });

            request.on('requestCompleted', function () {
                context.log(ipadd);
                context.res = {
                    body: JSON.stringify(ipadd,null,2),
                    headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type':'text/html'
            
                    }
                }
                context.done();


            });
            connection.execSql(request);
           
        });
    } else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string"
        };
   
    }

    
};