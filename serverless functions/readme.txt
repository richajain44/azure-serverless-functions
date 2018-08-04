This folder contains 7 Azure Serverless Functions. Below is the snapshot of all functionalities of each of them

1. smartbincreation - This function is invoked when Raspberry Pi is installed in the Bin for the first time.
The function saves bin detials to the Azure SQL Database. Bin details -BinId, BinLatitute,BinLongitude, BinType

2. smartbintransactions - This function is triggered whenever there is violation detected at the Bin(Raspberry Pi).
The function saves the bin transactions detials to the Azure SQL Database. 
Transactions details - BinId, Violation Type, Timestamp, ImageURL of the violation

3. smartconfiguration - This function is triggered whenever the entire system is installed for the first time. 
The admin can set what is recyclable in his/her division. The parameters are saved to Azure SQL Database as well as passed 
as message to Azure Service Bus Queue.

4. smartqueuetrigger - This function is triggered when a new message is present in the Service Bus Queue. 
The message is passed to the IoT hub and then delivered to the IoT Edge devices. These are then set to identify the violation

5. smartwebapp - This function is triggered when the WebApp is used. It displays all the Bin on the Web Map.

6. smartwebbindetials - This function is triggered when a particular Bin on the WebMap is accessed. It displays the specific
BinType and analytics of different type of violatins that occured.

7. smartimageurl - This function is triggered when a particular Bin on the WebApp is accessed. 
It dispalys the latest violation image for that Bin.