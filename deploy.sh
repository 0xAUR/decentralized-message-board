#!/bin/bash

# Check if network is provided
if [ -z "$1" ]; then
  echo "Usage: ./deploy.sh [sepolia|mumbai]"
  exit 1
fi

NETWORK=$1

# Validate network parameter
if [ "$NETWORK" != "sepolia" ] && [ "$NETWORK" != "mumbai" ]; then
  echo "Invalid network. Please specify 'sepolia' or 'mumbai'."
  exit 1
fi

echo "🚀 Deploying MessageBoard contract to $NETWORK testnet"
echo "===================================================="

# Compile the contracts
echo "📦 Compiling contracts..."
npx hardhat compile

# Deploy to the specified network
echo "🌐 Deploying to $NETWORK..."
npx hardhat run scripts/deploy.js --network $NETWORK

# Copy the latest ABI to the frontend
echo "📋 Copying contract ABI to frontend..."
cp artifacts/contracts/MessageBoard.sol/MessageBoard.json frontend/src/utils/MessageBoardABI.json

echo "✅ Done!"
echo "Contract address has been automatically updated in frontend/.env.local"
