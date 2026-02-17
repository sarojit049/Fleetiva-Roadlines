# 🐳 Docker Setup Guide - Fleetiva Roadlines

This guide provides comprehensive instructions for setting up Fleetiva Roadlines using Docker and Docker Compose.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Configuration](#configuration)

---

## Prerequisites

Before starting, ensure you have installed:

1. **Docker Desktop** (recommended) or Docker Engine

   - [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)
   - Minimum version: Docker 20.10+
   - Docker Compose version: 1.29+ (included with Docker Desktop)
2. **System Requirements**

   - RAM: At least 4GB available
   - Disk Space: 5GB free space
   - OS: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)
3. **Git** (to clone the repository)

---

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/sarojit049/Fleetiva-Roadlines.git
cd Fleetiva-Roadlines
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

**Optional**: Edit `.env` to customize settings. The defaults are sufficient for local development.

### 3. Start the Application

```bash
docker compose up --build
```

This command will:

- ✅ Build the Node.js backend Docker image
- ✅ Pull MongoDB 7.0 image
- ✅ Pull Redis 7 Alpine image
- ✅ Create Docker network
- ✅ Create persistent volumes
- ✅ Start all services

### 4. Verify Installation

Once all services are running, you should see:

```
✅ MongoDB connected
✅ Redis connected
🚀 Server running on port 5000
```

Access the services:

- **Backend API**: http://localhost:5000
- **MongoDB**: `localhost:27017`
- **Redis**: `localhost:6379`

### 5. Test the API

```bash
curl http://localhost:5000/api/health
```

Expected response:

```json
{"status": "ok"}
```

---

## Architecture

### Services Overview

```
┌─────────────────────────────────────────────┐
│           Docker Compose Stack              │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Backend  │  │ MongoDB  │  │  Redis   │   │
│  │ Node.js  │  │   7.0    │  │    7     │   │
│  │  :5000   │  │  :27017  │  │  :6379   │   │
│  └──────────┘  └──────────┘  └──────────┘   │
│       │             │              │        │
│       └─────────────┴──────────────┘        │
│            fleetiva-network                 │
└─────────────────────────────────────────────┘
```

### Container Details

#### 1. **Backend Service** (`fleetiva-backend`)

- **Image**: Built from backend/Dockerfile
- **Port**: 5000
- **Environment**: Development mode with hot reload
- **Volumes**:
  - Source code mounted for live development
  - `node_modules` volume for dependency isolation

#### 2. **MongoDB Service** (`fleetiva-mongo`)

- **Image**: `mongo:7.0`
- **Port**: 27017
- **Volumes**:
  - `mongo_data`: Database files
  - `mongo_config`: Configuration files
- **Health Check**: Automatic via `mongosh ping`

#### 3. **Redis Service** (`fleetiva-redis`)

- **Image**: `redis:7-alpine`
- **Port**: 6379
- **Volumes**: `redis_data` for persistence
- **Features**: AOF persistence enabled, password protected

---

## Configuration

### Environment Variables

#### Core Settings

| Variable     | Default     | Description             |
| ------------ | ----------- | ----------------------- |
| `NODE_ENV` | development | Application environment |
| `PORT`     | 5000        | Backend server port     |

#### MongoDB Settings

| Variable                | Default                                                        | Description               |
| ----------------------- | -------------------------------------------------------------- | ------------------------- |
| `MONGO_URI`           | mongodb://admin:password@mongo:27017/fleetiva?authSource=admin | MongoDB connection string |
| `MONGO_ROOT_USERNAME` | admin                                                          | MongoDB root username     |
| `MONGO_ROOT_PASSWORD` | password                                                       | MongoDB root password     |
| `MONGO_DATABASE`      | fleetiva                                                       | Database name             |

#### Redis Settings

| Variable           | Default                           | Description             |
| ------------------ | --------------------------------- | ----------------------- |
| `REDIS_URL`      | redis://:redispassword@redis:6379 | Redis connection string |
| `REDIS_PASSWORD` | redispassword                     | Redis password          |

#### Application Settings

| Variable          | Default                                             | Description                  |
| ----------------- | --------------------------------------------------- | ---------------------------- |
| `JWT_SECRET`    | your_super_secret_jwt_key_change_this_in_production | JWT signing key              |
| `FRONTEND_URL`  | http://localhost:5173                               | Frontend URL for CORS        |
| `SKIP_FIREBASE` | true                                                | Skip Firebase initialization |

### Customizing Configuration

1. **Change Database Credentials**:

   ```env
   MONGO_ROOT_USERNAME=myuser
   MONGO_ROOT_PASSWORD=mysecurepassword
   ```
2. **Change Redis Password**:

   ```env
   REDIS_PASSWORD=myredispassword
   ```
3. **Add Firebase Support**:

   ```env
   SKIP_FIREBASE=false
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY=your-private-key
   FIREBASE_CLIENT_EMAIL=your-client-email
   ```

## Troubleshooting

### Issue: Port Already in Use

**Error**: `Bind for 0.0.0.0:5000 failed: port is already allocated`

**Solution**:

1. Check what's using the port:

   ```bash
   # Linux/Mac
   lsof -i :5000

   # Windows
   netstat -ano | findstr :5000
   ```
2. Either stop the conflicting service or change the port in `.env`:

   ```env
   PORT=5001
   ```

### Issue: MongoDB Connection Failed

**Error**: `MongoServerError: Authentication failed`

**Solution**:

1. Ensure `.env` credentials match `docker-compose.yml`
2. Restart services:
   ```bash
   docker compose down -v
   docker compose up --build
   ```

### Issue: Container Keeps Restarting

**Solution**:

1. Check container logs:

   ```bash
   docker compose logs backend
   ```
2. Check service health:

   ```bash
   docker compose ps
   ```
3. Verify environment variables are set correctly in `.env`

### Issue: Changes Not Reflecting

**Solution**:

1. Rebuild the container:

   ```bash
   docker compose up --build
   ```
2. For code changes, ensure volume mounting is correct in `docker-compose.yml`

### Issue: Out of Disk Space

**Solution**:

1. Remove unused containers and volumes:

   ```bash
   docker system prune -a
   docker volume prune
   ```
2. Check disk usage:

   ```bash
   docker system df
   ```

---

## Development Workflow

### Hot Reload

The backend service is configured with volume mounting, so code changes automatically trigger a restart:

1. Edit any file in `backend/`
2. Save the file
3. Watch the logs to see the server restart:
   ```bash
   docker compose logs -f backend
   ```

### Debugging

1. **Enable Node.js Debugging**:
   Update `docker-compose.yml`:

   ```yaml
   backend:
     command: npm run dev -- --inspect=0.0.0.0:9229
     ports:
       - "5000:5000"
       - "9229:9229"
   ```
2. **Attach Debugger** from VS Code or Chrome DevTools

---

## Production Considerations

### Security

1. **Change All Default Passwords**:

   ```env
   MONGO_ROOT_PASSWORD=use-a-strong-password-here
   REDIS_PASSWORD=use-a-strong-redis-password
   JWT_SECRET=use-a-cryptographically-secure-secret
   ```
2. **Use Docker Secrets** (for Docker Swarm):

   ```yaml
   secrets:
     mongo_password:
       external: true
   ```
3. **Limit Resource Usage**:

   ```yaml
   backend:
     deploy:
       resources:
         limits:
           cpus: '1'
           memory: 512M
   ```

### Networking

1. **Remove Port Exposure** for internal services:

   ```yaml
   mongo:
     # Remove or comment out ports section
     # ports:
     #   - "27017:27017"
   ```
2. **Use Reverse Proxy** (nginx, Traefik) for SSL termination

### Backup Strategy

1. **Automated MongoDB Backups**:

   ```bash
   # Create backup script
   docker compose exec mongo mongodump --out /data/backup/$(date +%Y%m%d)
   ```
2. **Scheduled Backups** using cron or systemd timers

---
