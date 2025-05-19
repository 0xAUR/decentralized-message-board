#!/bin/bash

# Network testing script for decentralized message board
# This script helps test connections to various Ethereum networks

# Color codes for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Web3 Connection Testing Utility      ${NC}"
echo -e "${BLUE}========================================${NC}"

# Check if node is installed
if ! [ -x "$(command -v node)" ]; then
  echo -e "${RED}Error: Node.js is not installed.${NC}" >&2
  exit 1
fi

# Check if hardhat is installed
if ! [ -x "$(command -v npx)" ]; then
  echo -e "${RED}Error: npx is not installed.${NC}" >&2
  exit 1
fi

# Function to start a local hardhat node for testing
start_local_node() {
  echo -e "${YELLOW}Starting local Hardhat node in a new terminal...${NC}"
  
  # Open a new terminal window and start hardhat node
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    osascript -e 'tell application "Terminal" to do script "cd '$(pwd)' && npx hardhat node"'
  else
    # Linux
    x-terminal-emulator -e "cd $(pwd) && npx hardhat node" &
  fi
  
  echo -e "${GREEN}Local Hardhat node should now be running in a separate terminal.${NC}"
  echo -e "${YELLOW}Waiting for node to initialize...${NC}"
  sleep 3
}

# Function to deploy contract to local network
deploy_local() {
  echo -e "${YELLOW}Deploying contract to local network...${NC}"
  
  # Check if the deploy script exists
  if [ ! -f "./scripts/deploy.js" ]; then
    echo -e "${RED}Error: deploy.js script not found.${NC}"
    return 1
  fi
  
  # Run the deployment script
  npx hardhat run scripts/deploy.js --network localhost
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}Contract deployed successfully to local network.${NC}"
    # Save deployment info for the frontend
    echo "VITE_CONTRACT_ADDRESS=$(grep -o '0x[a-fA-F0-9]\{40\}' deployment-info.json)" > ./frontend/.env.local
    echo "VITE_NETWORK=localhost" >> ./frontend/.env.local
    
    echo -e "${GREEN}Environment variables set in frontend/.env.local${NC}"
  else
    echo -e "${RED}Contract deployment failed.${NC}"
    return 1
  fi
}

# Function to test frontend with local network
test_frontend_local() {
  echo -e "${YELLOW}Starting frontend in development mode...${NC}"
  
  cd frontend
  
  # Check if npm dependencies are installed
  if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
  fi
  
  # Start the frontend
  echo -e "${GREEN}Starting Vite dev server...${NC}"
  npm run dev
}

# Function to run a test on Sepolia testnet
test_sepolia() {
  echo -e "${YELLOW}Testing connection to Sepolia testnet...${NC}"
  
  # Create a simple test script
  cat > test-sepolia.js << EOL
const { ethers } = require('ethers');

async function main() {
  try {
    // Connect to Sepolia via Infura or other provider
    const provider = new ethers.providers.JsonRpcProvider('https://sepolia.infura.io/v3/YOUR_INFURA_KEY');
    
    // Get the latest block number
    const blockNumber = await provider.getBlockNumber();
    console.log('Successfully connected to Sepolia testnet');
    console.log('Current block number: ' + blockNumber);
    
    return true;
  } catch (error) {
    console.error('Failed to connect to Sepolia testnet');
    console.error(error.message);
    return false;
  }
}

main()
  .then((success) => process.exit(success ? 0 : 1))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
EOL

  # Run the test script
  node test-sepolia.js
  
  # Clean up
  rm test-sepolia.js
}

# Main menu function
show_menu() {
  echo -e "${BLUE}========================================${NC}"
  echo -e "${BLUE}   Select a testing option:             ${NC}"
  echo -e "${BLUE}========================================${NC}"
  echo -e "1) Start local Hardhat node"
  echo -e "2) Deploy contract to local network"
  echo -e "3) Test frontend with local network"
  echo -e "4) Test connection to Sepolia testnet"
  echo -e "5) Test frontend with Sepolia testnet"
  echo -e "0) Exit"
  echo -e "${BLUE}----------------------------------------${NC}"
  
  read -p "Enter your choice: " choice
  
  case $choice in
    1)
      start_local_node
      ;;
    2)
      deploy_local
      ;;
    3)
      test_frontend_local
      ;;
    4)
      test_sepolia
      ;;
    5)
      echo -e "${YELLOW}You need to edit frontend/.env.local and add your contract address and NETWORK=sepolia${NC}"
      read -p "Have you configured your .env.local file? (y/n): " confirm
      if [ "$confirm" = "y" ]; then
        test_frontend_local
      fi
      ;;
    0)
      echo -e "${GREEN}Goodbye!${NC}"
      exit 0
      ;;
    *)
      echo -e "${RED}Invalid option. Please try again.${NC}"
      ;;
  esac
  
  # Return to menu after completing task
  echo ""
  read -p "Press Enter to return to the menu..."
  show_menu
}

# Start the menu
show_menu
