# Docker Deployment Guide

This guide explains how to build and run the CvSU Campus Map application using Docker.

## Prerequisites

- Docker installed on your system ([Install Docker](https://docs.docker.com/get-docker/))
- Docker Compose installed (usually comes with Docker Desktop)

## Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Build and start the container:**
   ```bash
   docker-compose up -d
   ```

2. **Access the application:**
   Open your browser and navigate to: `http://localhost:8080`

3. **Stop the container:**
   ```bash
   docker-compose down
   ```

### Option 2: Using Docker CLI

1. **Build the Docker image:**
   ```bash
   docker build -t cvsu-campus-map .
   ```

2. **Run the container:**
   ```bash
   docker run -d \
     --name cvsu-campus-map \
     -p 8080:80 \
     -v $(pwd)/uploads:/var/www/html/uploads \
     -v $(pwd)/api/pins.json:/var/www/html/api/pins.json \
     cvsu-campus-map
   ```

3. **Access the application:**
   Open your browser and navigate to: `http://localhost:8080`

4. **Stop the container:**
   ```bash
   docker stop cvsu-campus-map
   docker rm cvsu-campus-map
   ```

## Login Credentials

- **Administrator:**
  - Email: `admin@admin.com`
  - Password: `admin`

- **Guest Access:**
  - Click "Or enter as a guest" button on the login page

## Container Management

### View container logs:
```bash
docker-compose logs -f
```
or
```bash
docker logs -f cvsu-campus-map
```

### Restart the container:
```bash
docker-compose restart
```
or
```bash
docker restart cvsu-campus-map
```

### Rebuild after code changes:
```bash
docker-compose up -d --build
```
or
```bash
docker build -t cvsu-campus-map .
docker stop cvsu-campus-map
docker rm cvsu-campus-map
docker run -d --name cvsu-campus-map -p 8080:80 \
  -v $(pwd)/uploads:/var/www/html/uploads \
  -v $(pwd)/api/pins.json:/var/www/html/api/pins.json \
  cvsu-campus-map
```

## Data Persistence

The following directories/files are mounted as volumes to persist data:
- `./uploads` - Stores uploaded images
- `./api/pins.json` - Stores pin location data

Even if you remove the container, your data will remain in these local directories.

## Customization

### Change the port:
Edit `docker-compose.yml` and modify the ports section:
```yaml
ports:
  - "3000:80"  # Change 3000 to your desired port
```

### Adjust PHP upload limits:
The Dockerfile is configured with:
- `upload_max_filesize = 10M`
- `post_max_size = 10M`
- `memory_limit = 256M`

To change these, edit the Dockerfile and rebuild.

## Troubleshooting

### Permission issues with uploads:
```bash
sudo chmod -R 777 uploads/
sudo chmod 666 api/pins.json
```

### Container won't start:
Check if port 8080 is already in use:
```bash
docker-compose logs
```

### Reset everything:
```bash
docker-compose down
docker rmi cvsu-campus-map
docker-compose up -d --build
```

## Production Deployment

For production environments:

1. **Use environment variables for sensitive data** (instead of hardcoded credentials)
2. **Set up HTTPS** using a reverse proxy like Nginx or Traefik
3. **Configure proper backup** for the uploads directory and pins.json
4. **Use Docker secrets** for credential management
5. **Set resource limits** in docker-compose.yml:
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '1'
         memory: 512M
   ```

## Architecture

The Docker setup includes:
- **Base Image:** PHP 8.2 with Apache
- **Extensions:** GD library for image processing
- **Web Server:** Apache with mod_rewrite enabled
- **Port:** 80 (internal) mapped to 8080 (host)
- **Volumes:** Persistent storage for uploads and data
