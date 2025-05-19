# Decentralized Message Board

A fully functional Web3 application that allows users to post and view messages on the blockchain, similar to a decentralized X or guestbook.

## Features

- 💬 Post messages to the Ethereum blockchain
- 🔍 View all messages in a feed (newest first)
- ❤️ Like system for messages (on-chain)
- 🚫 Rate limiting to prevent spam (one post per hour per wallet)
- 👤 Wallet connection with MetaMask
- 🔗 ENS name resolution (on supported networks)
- 🌓 Dark mode / Light mode support
- ⚡ Optimized loading states and animations

## Tech Stack

- **Smart Contract**: Solidity
- **Frontend**: React, Vite, TailwindCSS
- **Blockchain Integration**: ethers.js
- **Dev Environment**: Hardhat
- **Networks**: Supports Sepolia and Mumbai testnets

## Quick Start

### Prerequisites

- Node.js (v18+)
- npm or yarn
- MetaMask extension installed in your browser

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd decentralized-message-board
   ```

2. Install dependencies:
   ```bash
   # Install root project dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

3. Set up environment variables:
   ```bash
   # Copy the example .env file and update with your values
   cp .env.example .env
   ```
   
   Update `.env` with:
   - `PRIVATE_KEY`: Your Ethereum wallet private key for deploying contracts
   - `SEPOLIA_RPC_URL`: Alchemy or Infura endpoint URL for Sepolia
   - `MUMBAI_RPC_URL`: Alchemy or Infura endpoint URL for Mumbai

## Development

### Local Development (Recommended for Testing)

1. Start a local Hardhat node and deploy the contract:
   ```bash
   # Make script executable
   chmod +x start-local.sh
   
   # Run local blockchain and deploy contract
   ./start-local.sh
   ```

2. In a new terminal, start the frontend:
   ```bash
   chmod +x start-frontend.sh
   ./start-frontend.sh
   ```

3. Open your browser to http://localhost:5173

The frontend will automatically connect to your local blockchain. Use MetaMask and import one of the local accounts using the private key shown in the terminal.

### Testnet Deployment

1. Deploy the contract to a testnet:
   ```bash
   # Make script executable
   chmod +x deploy.sh
   
   # Deploy to Sepolia testnet
   ./deploy.sh sepolia
   
   # Or deploy to Mumbai testnet
   ./deploy.sh mumbai
   ```

2. Start the frontend:
   ```bash
   ./start-frontend.sh
   ```

3. Open your browser to http://localhost:5173

4. Connect your MetaMask to the appropriate testnet.

## Contract Details

The MessageBoard contract provides the following functionality:

- Post messages to the blockchain (rate-limited to one post per hour)
- Like messages (can't like your own)
- View the complete message history

## Troubleshooting

- **MetaMask Connection Issues**: Make sure you're connected to the correct network
- **Transaction Errors**: Check that you have enough ETH for gas fees
- **Rate Limit Errors**: You can only post once per hour per wallet

## License

This project is licensed under the MIT License.

## Project Structure

```
decentralized-message-board/
  ├── contracts/              # Smart contract code
  │   └── MessageBoard.sol    # Main message board contract
  ├── frontend/               # React frontend application
  │   ├── src/                # React source code
  │   │   ├── components/     # Reusable UI components
  │   │   ├── context/        # Web3 context for blockchain integration
  │   │   ├── pages/          # Page components
  │   │   └── utils/          # Utility functions and ABI
  │   └── ...                 # Vite and configuration files
  ├── scripts/                # Deployment scripts
  └── test/                   # Contract tests
```

## Getting Started

### Installation

1. Clone this repository:
   ```
   git clone <repository-url>
   cd decentralized-message-board
   ```

2. Install dependencies for the main project:
   ```
   npm install
   ```

3. Install dependencies for the frontend:
   ```
   cd frontend
   npm install
   cd ..
   ```

### Smart Contract Deployment

1. Set up environment variables by copying the example file:
   ```
   cp .env.example .env
   ```

2. Edit the `.env` file with your private key and RPC URLs:
   ```
   PRIVATE_KEY=your_private_key_without_0x_prefix
   SEPOLIA_RPC_URL=your_sepolia_rpc_url
   MUMBAI_RPC_URL=your_mumbai_rpc_url
   ```

3. Compile the smart contracts:
   ```
   npx hardhat compile
   ```

4. Deploy to Sepolia testnet:
   ```
   npx hardhat run scripts/deploy.js --network sepolia
   ```
   
   Or deploy to Mumbai testnet:
   ```
   npx hardhat run scripts/deploy.js --network mumbai
   ```

5. Update the contract address in the frontend configuration:
   - Copy the deployed contract address
   - Create a `.env.local` file in the frontend directory
   - Add the contract address: `VITE_CONTRACT_ADDRESS=your_contract_address`

### Running the Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Testing

Run the test suite for the smart contracts:

```
npx hardhat test
```

## Interacting with the Dapp

1. Connect your MetaMask wallet by clicking the "Connect Wallet" button
2. Make sure you're connected to Sepolia or Mumbai testnet
3. Post a message using the form
4. View your message in the feed
5. Like other users' messages

## License

This project is licensed under the MIT License - see the LICENSE file for details.
