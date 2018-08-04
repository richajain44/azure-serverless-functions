//This function is part of Azure IoT Serverless Challenge
//Function to fetch ImageURL from the database. This function is used when the 
//WebApp dispalys the image of the latest violation for the specific Bin.
//The WebApp triggers the Azure serverless function. 
//The function fetches the URL from the Azure SQL Database
//Input Paramerters - BinId
//BinId - MAC address of the Pi
//Return - Success Message with the URL
//URL of the function with sample data : https://smartwasteanalytics.azurewebsites.net/api/smartwasteanalytics?binid=bin145

Connection = require('tedious').Connection;
Request = require('tedious').Request;

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function');
    var ipadd=[];
    let bId = req.query.binid
    config = {
        userName: 'smartwasteadmin',
        password: '*********',
        server: 'smartwastebin.database.windows.net',
        options: {
            database:'bindb',
            encrypt: true
        }
    };
    
    connection = new Connection(config);
    connection.on('connect',function(err){
    context.log('connection done');
	//SQL command to fetch the URL
    request = new Request("SELECT t1.URL from Transactions t1 where t1.BinId='"+bId+"'"+" and t1.Timestamp=(select max(t2.Timestamp) from Transactions t2 where t2.BinId ='"+bId+"'"+")" , (err, rows) => {
            context.log('inside exe');
            if (err) {
                context.log(err);
                } 
            else {
                context.log('rows: ' + rows);
                }

            connection.close();

            }); 

            request.on('row', function (columns) {
            var row={};                
            columns.forEach(function(column){
                row[column.metadata.colName]=column.value;
            });

            ipadd.push(row);

            });

            request.on('requestCompleted', function() {
                context.res = {               
                    body: JSON.stringify(ipadd,null,2),
                    headers: {'Content-Type': 'text/html'}
                }
                context.done();

            });
            connection.execSql(request);
        });
}