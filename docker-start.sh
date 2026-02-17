#!/bin/bash

# Fleetiva Roadlines - Docker Quick Start Script
# This script helps you get started with Docker Compose quickly

set -e  # Exit on any error

echo "🚀 Fleetiva Roadlines - Docker Setup"
echo "===================================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    echo "Please install Docker from: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed${NC}"
    echo "Please install Docker Compose from: https://docs.docker.com/compose/install/"
    exit 1
fi

echo -e "${GREEN}✅ Docker is installed${NC}"

# Determine docker compose command (v1 vs v2)
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

echo -e "${GREEN}✅ Docker Compose is installed${NC}"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created${NC}"
    echo -e "${YELLOW}💡 You can edit .env to customize your configuration${NC}"
    echo ""
else
    echo -e "${GREEN}✅ .env file exists${NC}"
    echo ""
fi

# Ask user what they want to do
echo "What would you like to do?"
echo "1) Start all services (build and run)"
echo "2) Start all services in background"
echo "3) Stop all services"
echo "4) View logs"
echo "5) Clean up (remove containers and volumes)"
echo "6) Check service status"
echo ""
read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo ""
        echo -e "${YELLOW}🔨 Building and starting services...${NC}"
        $COMPOSE_CMD up --build
        ;;
    2)
        echo ""
        echo -e "${YELLOW}🔨 Building and starting services in background...${NC}"
        $COMPOSE_CMD up --build -d
        echo ""
        echo -e "${GREEN}✅ Services started successfully!${NC}"
        echo ""
        echo "Access points:"
        echo "  • Backend API: http://localhost:5000"
        echo "  • MongoDB: localhost:27017"
        echo "  • Redis: localhost:6379"
        echo ""
        echo "View logs with: $COMPOSE_CMD logs -f"
        ;;
    3)
        echo ""
        echo -e "${YELLOW}🛑 Stopping all services...${NC}"
        $COMPOSE_CMD down
        echo -e "${GREEN}✅ All services stopped${NC}"
        ;;
    4)
        echo ""
        echo -e "${YELLOW}📋 Viewing logs (Ctrl+C to exit)...${NC}"
        $COMPOSE_CMD logs -f
        ;;
    5)
        echo ""
        echo -e "${RED}⚠️  WARNING: This will delete all data in Docker volumes!${NC}"
        read -p "Are you sure? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            echo -e "${YELLOW}🗑️  Cleaning up...${NC}"
            $COMPOSE_CMD down -v
            echo -e "${GREEN}✅ Cleanup complete${NC}"
        else
            echo "Cleanup cancelled"
        fi
        ;;
    6)
        echo ""
        echo -e "${YELLOW}📊 Service status:${NC}"
        $COMPOSE_CMD ps
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}Done!${NC}"
