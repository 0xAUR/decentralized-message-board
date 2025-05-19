const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Get the contract factory
  const MessageBoard = await hre.ethers.getContractFactory("MessageBoard");
  
  // Deploy the contract
  console.log("Deploying MessageBoard contract...");
  const messageBoard = await MessageBoard.deploy();
  
  // Wait for deployment transaction to be mined
  console.log("Waiting for deployment to be confirmed...");
  await messageBoard.waitForDeployment();
  
  // Get the contract address
  const messageBoardAddress = await messageBoard.getAddress();
  
  console.log(`MessageBoard contract deployed to ${messageBoardAddress}`);
  
  // Save the contract address to a file for the frontend
  const deploymentInfo = {
    contractAddress: messageBoardAddress,
    network: hre.network.name,
    timestamp: new Date().toISOString()
  };
  
  // Create a deployment-info.json file in the project root
  fs.writeFileSync(
    path.join(__dirname, "../deployment-info.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log(`Deployment info saved to deployment-info.json`);
  
  // Create or update .env.local file for the frontend
  const envContent = `VITE_CONTRACT_ADDRESS=${messageBoardAddress}\nVITE_NETWORK=${hre.network.name}`;
  fs.writeFileSync(
    path.join(__dirname, "../frontend/.env.local"),
    envContent
  );
  
  console.log(`Updated frontend/.env.local with new contract address`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during deployment:");
    console.error(error);
    process.exit(1);
  });
