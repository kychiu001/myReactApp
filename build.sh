#!/bin/bash 

# Retrieve the IP address 
IP_ADDRESS=$(hostname -I | awk '{print $1}') 

# Export the environment variable 
export REACT_APP_IP_ADDRESS=$IP_ADDRESS 

# Run the build command 
npm run build 
