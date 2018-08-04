//This function is part of Azure IoT Serverless Challenge
//Function part of  setting the Configuration detials. It is triggered when the function sends a message in the Service Bus Queue. 
//This function is sends the message to the IoT Hub which then sends it to IoT Edge Devices
//The Azure Service Bus Queue triggers the Azure serverless function with the input message
//The function then sends these message to the IoT Edge Devices
//Input Paramerter - message
//Output - MEssage to the IoT Edge Devices



'use strict';

var Client = require('azure-iothub').Client;
var Message = require('azure-iot-common').Message;
module.exports = function(context, mySbMsg) {
    
    context.log('Node.js ServiceBus queue trigger function processed message', mySbMsg);
    context.log('EnqueuedTimeUtc =', context.bindingData.enqueuedTimeUtc);
    context.log('DeliveryCount =', context.bindingData.deliveryCount);
    context.log('MessageId =', context.bindingData.messageId);

    
    var connectionString = 'HostName=configurationdetaisl.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=***********************';
    var targetDevice = 'device1122';
    var serviceClient = Client.fromConnectionString(connectionString);
    function printResultFor(op) {
    return function printResult(err, res) {
        if (err) context.log(op + ' error: ' + err.toString());
        if (res) context.log(op + ' status: ' + res.constructor.name);
    };
    }
    function receiveFeedback(err, receiver){
        receiver.on('message', function (msg) {
        context.log('Feedback message:')
        context.log(msg.getData().toString('utf-8'));
    });
    }

    serviceClient.open(function (err) {
    if (err) {
        context.error('Could not connect: ' + err.message);
    } else {
        context.log('Service client connected');
        serviceClient.getFeedbackReceiver(receiveFeedback);
        var message = new Message(mySbMsg);
        message.ack = 'full';
        message.messageId = "My Message ID";
        context.log('Sending message: ' + message.getData());
        serviceClient.send(targetDevice, message, printResultFor('send'));
    }
    });

    context.done();
};