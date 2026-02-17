@echo off
REM Fleetiva Roadlines - Docker Quick Start Script for Windows
REM This script helps you get started with Docker Compose quickly

echo ================================
echo Fleetiva Roadlines - Docker Setup
echo ================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed
    echo Please install Docker Desktop from: https://docs.docker.com/desktop/install/windows-install/
    pause
    exit /b 1
)

echo [OK] Docker is installed

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    docker compose version >nul 2>&1
    if %errorlevel% neq 0 (
        echo [ERROR] Docker Compose is not installed
        echo Please install Docker Desktop which includes Docker Compose
        pause
        exit /b 1
    )
    set COMPOSE_CMD=docker compose
) else (
    set COMPOSE_CMD=docker-compose
)

echo [OK] Docker Compose is installed
echo.

REM Check if .env file exists
if not exist ".env" (
    echo [WARNING] .env file not found
    echo Creating .env from .env.example...
    copy .env.example .env >nul
    echo [OK] .env file created
    echo [INFO] You can edit .env to customize your configuration
    echo.
) else (
    echo [OK] .env file exists
    echo.
)

REM Menu
echo What would you like to do?
echo 1. Start all services (build and run)
echo 2. Start all services in background
echo 3. Stop all services
echo 4. View logs
echo 5. Clean up (remove containers and volumes)
echo 6. Check service status
echo.

set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" (
    echo.
    echo Building and starting services...
    %COMPOSE_CMD% up --build
) else if "%choice%"=="2" (
    echo.
    echo Building and starting services in background...
    %COMPOSE_CMD% up --build -d
    echo.
    echo [OK] Services started successfully!
    echo.
    echo Access points:
    echo   - Backend API: http://localhost:5000
    echo   - MongoDB: localhost:27017
    echo   - Redis: localhost:6379
    echo.
    echo View logs with: %COMPOSE_CMD% logs -f
) else if "%choice%"=="3" (
    echo.
    echo Stopping all services...
    %COMPOSE_CMD% down
    echo [OK] All services stopped
) else if "%choice%"=="4" (
    echo.
    echo Viewing logs (Ctrl+C to exit)...
    %COMPOSE_CMD% logs -f
) else if "%choice%"=="5" (
    echo.
    echo [WARNING] This will delete all data in Docker volumes!
    set /p confirm="Are you sure? (yes/no): "
    if "%confirm%"=="yes" (
        echo Cleaning up...
        %COMPOSE_CMD% down -v
        echo [OK] Cleanup complete
    ) else (
        echo Cleanup cancelled
    )
) else if "%choice%"=="6" (
    echo.
    echo Service status:
    %COMPOSE_CMD% ps
) else (
    echo Invalid choice
    pause
    exit /b 1
)

echo.
echo Done!
pause
