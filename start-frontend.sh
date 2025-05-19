#!/bin/bash

echo "🚀 Starting Decentralized Message Board Frontend"
echo "================================================="

# Navigate to frontend directory
cd frontend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo "📦 Installing frontend dependencies..."
  npm install
fi

# Start the development server
echo "🌐 Starting development server..."
npm run dev
