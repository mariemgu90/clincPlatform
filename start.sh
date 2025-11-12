#!/bin/bash

# MedFlow Clinic Platform - Startup Script
echo "🚀 Starting MedFlow Clinic Platform..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate
echo ""

# Push database schema
echo "💾 Setting up database..."
npx prisma db push
echo ""

# Seed database
echo "🌱 Seeding database with initial data..."
node prisma/seed.js
echo ""

# Start development server
echo "✨ Starting Next.js development server..."
echo "🌐 Application will be available at http://localhost:3000"
echo ""
npm run dev
