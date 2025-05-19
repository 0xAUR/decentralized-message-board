#!/bin/bash

echo "🚀 Starting a local Hardhat node and deploying the MessageBoard contract"
echo "===================================================================="

# Start local Hardhat node in the background
echo "🌐 Starting local Hardhat node..."
npx hardhat node > hardhat_node.log 2>&1 &
NODE_PID=$!

# Give node time to start up
echo "⏳ Waiting for node to start..."
sleep 5

# Extract and display first account and private key from the Hardhat node
FIRST_ACCOUNT=$(grep -m 1 "Account #0:" hardhat_node.log | awk '{print $3}')
PRIVATE_KEY=$(grep -m 1 "Private Key:" hardhat_node.log | awk '{print $4}')

if [ ! -z "$FIRST_ACCOUNT" ] && [ ! -z "$PRIVATE_KEY" ]; then
  echo "📝 Local development account:"
  echo "   Address: $FIRST_ACCOUNT"
  echo "   Private Key: $PRIVATE_KEY"
  echo "   Balance: 10000 ETH"
  echo ""
fi

# Compile the contracts
echo "📦 Compiling contracts..."
npx hardhat compile

# Deploy contract to local network
echo "📦 Deploying contract to localhost..."
npx hardhat run scripts/deploy.js --network localhost

# Copy the latest ABI to the frontend
echo "📋 Copying contract ABI to frontend..."
mkdir -p frontend/src/utils
cp artifacts/contracts/MessageBoard.sol/MessageBoard.json frontend/src/utils/MessageBoardABI.json

echo ""
echo "🔥 Local Hardhat node is running in the background (PID: $NODE_PID)"
echo "💡 To stop the node later, run: kill $NODE_PID"
echo ""
echo "🚀 Now you can start the frontend with: ./start-frontend.sh"

# Write the deployment output to a file for debugging
echo "$DEPLOY_OUTPUT" > deploy.log

# Extract the contract address from the deployment output
CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep -oP 'MessageBoard contract deployed to \K[0-9a-fA-Fx]+')

# If we found a contract address, update the frontend .env.local file
if [ ! -z "$CONTRACT_ADDRESS" ]; then
  echo "✅ Contract deployed to: $CONTRACT_ADDRESS"
  echo "VITE_CONTRACT_ADDRESS=$CONTRACT_ADDRESS" > frontend/.env.local
  echo "VITE_NETWORK=localhost" >> frontend/.env.local
  echo "✅ Updated frontend/.env.local with contract address"
else
  echo "⚠️ Could not automatically extract contract address."
  echo "⚠️ Please check deploy.log for the deployment output."
  echo "⚠️ Then manually update frontend/.env.local with the deployed contract address."
fi
  
  if [ ! -z "$CONTRACT_ADDRESS" ]; then
    echo "✅ Contract deployed to: $CONTRACT_ADDRESS"
    echo "VITE_CONTRACT_ADDRESS=$CONTRACT_ADDRESS" > frontend/.env.local
    echo "VITE_NETWORK=localhost" >> frontend/.env.local
    echo "✅ Updated frontend/.env.local with contract address"
  else 
    echo "⚠️ Could not automatically extract contract address."
    echo "⚠️ Please manually update frontend/.env.local with the deployed contract address."
  fi
fi

echo ""
echo "🔥 Local Hardhat node is running in the background (PID: $NODE_PID)"
echo "💡 To stop the node later, run: kill $NODE_PID"
echo ""
echo "🚀 Now you can start the frontend with: ./start-frontend.sh"
