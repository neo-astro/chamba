#!/bin/bash

# ProConnect Backend Setup Script

echo "🚀 ProConnect Backend Setup"
echo "============================"
echo ""

# Check if PostgreSQL is available
echo "Checking database connection..."
if command -v psql &> /dev/null; then
    echo "✓ PostgreSQL is installed"
else
    echo "✗ PostgreSQL is not installed. Please install PostgreSQL first."
    exit 1
fi

# Navigate to backend directory
cd backend

# Install dependencies
echo ""
echo "Installing dependencies..."
bun install

# Run migrations
echo ""
echo "Running database migrations..."
bun run db:migrate

echo ""
echo "✓ Backend setup complete!"
echo ""
echo "To start the backend server, run:"
echo "  cd backend"
echo "  bun run dev"
echo ""
echo "Backend will be available at: http://localhost:3001"
echo ""
