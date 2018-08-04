#include <stdio.h>
#include <stdlib.h>
#include<sys/types.h>
#include<sys/socket.h>
#include<netinet/in.h>
int main()
{
    //create socket
    int network_socket;
    network_socket = socket(AF_INET,SOCK_STREAM,0);
    //spcifying the address for the socket
    struct sockaddr_in server_address;
    server_address.sin_family = AF_INET;
    server_address.sin_port = htons(9002);
    server_address.sin_addr.s_addr = INADDR_ANY;

    int connect_status = connect(network_socket,(struct sockaddr *) &server_address, sizeof(server_address));

    //check for error in the connection
    if(connect_status == -1){
        printf("error in connection\n");
    }
    //receive data from server
    char server_response[256];
    recv(network_socket,&server_response,sizeof(server_response),0);
    //print the response
    printf("sever says:%s\n",server_response);
    //clsoe socket
    close(socket);
    return 0;
}
