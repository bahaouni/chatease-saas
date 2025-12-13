#!/bin/bash

set -e  # Exit immediately if a command fails

echo "🔄 Pulling latest code from main..."
git pull origin main

echo "🛑 Stopping containers..."
sudo docker-compose down

echo "🚀 Building and starting containers..."
sudo docker-compose up -d --build

echo "✅ Deployment completed successfully."
