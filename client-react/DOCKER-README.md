# 🐳 React Client Docker Setup

This guide explains how to use Docker with your React YouTube clone frontend.

## 📁 Files Created

- `Dockerfile` - Production build with nginx
- `Dockerfile.dev` - Development environment
- `docker-compose.yml` - Orchestration for both dev and prod
- `nginx.conf` - Nginx configuration for production
- `.dockerignore` - Excludes unnecessary files from build
- `deploy.sh` - Automated deployment script

## 🚀 Quick Start

### Option 1: Using the Deployment Script (Recommended)

```bash
# Make the script executable
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

The script will present you with options:
1. **Development deployment** (port 3000)
2. **Production deployment** (port 80)
3. **Build Docker image only**
4. **Cleanup containers and images**

### Option 2: Manual Docker Commands

#### Development Environment
```bash
# Build and run development container
docker-compose up -d frontend-dev

# View logs
docker-compose logs -f frontend-dev

# Stop development container
docker-compose down
```

#### Production Environment
```bash
# Build and run production container
docker-compose up -d frontend-prod

# View logs
docker-compose logs -f frontend-prod

# Stop production container
docker-compose down
```

#### Build Only
```bash
# Build production image
docker build -t youtube-clone-frontend .

# Build development image
docker build -f Dockerfile.dev -t youtube-clone-frontend:dev .
```

## 🔧 Configuration

### Environment Variables

The React app uses environment variables for configuration. Create a `.env` file in the client-react directory:

```env
# API URL (update this to match your backend)
REACT_APP_API_URL=http://localhost:8080/api/v1

# Other environment variables
REACT_APP_ENV=production
```

### Nginx Configuration

The `nginx.conf` file includes:
- ✅ React Router support (SPA routing)
- ✅ Gzip compression
- ✅ Security headers
- ✅ Static asset caching
- ✅ API proxy configuration
- ✅ Health check endpoint

## 🌐 Access Points

### Development
- **URL**: http://localhost:3000
- **Hot Reload**: ✅ Enabled
- **Source Maps**: ✅ Enabled

### Production
- **URL**: http://localhost
- **Optimized Build**: ✅ Enabled
- **Nginx Served**: ✅ Enabled

## 🔍 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   lsof -i :3000
   lsof -i :80
   
   # Kill the process or change ports in docker-compose.yml
   ```

2. **Build Failures**
   ```bash
   # Clean and rebuild
   docker-compose down
   docker system prune -f
   docker-compose up -d --build
   ```

3. **Permission Issues**
   ```bash
   # Fix script permissions
   chmod +x deploy.sh
   
   # Run with sudo if needed
   sudo docker-compose up -d
   ```

### Debug Commands

```bash
# Check container status
docker ps

# View container logs
docker logs youtube-clone-frontend-dev
docker logs youtube-clone-frontend-prod

# Access container shell
docker exec -it youtube-clone-frontend-dev sh
docker exec -it youtube-clone-frontend-prod sh

# Check nginx configuration
docker exec -it youtube-clone-frontend-prod nginx -t
```

## 📊 Performance Features

### Production Optimizations
- ✅ Multi-stage build (smaller image size)
- ✅ Nginx serving (faster than Node.js dev server)
- ✅ Gzip compression
- ✅ Static asset caching
- ✅ Security headers

### Development Features
- ✅ Hot reload enabled
- ✅ Volume mounting for live code changes
- ✅ Source maps for debugging
- ✅ Fast refresh

## 🔄 Updates and Maintenance

### Updating Dependencies
```bash
# Update package.json dependencies
npm update

# Rebuild containers
docker-compose down
docker-compose up -d --build
```

### Updating Code
```bash
# Development: Changes are reflected immediately
# Production: Rebuild required
docker-compose down
docker-compose up -d --build frontend-prod
```

### Backup and Restore
```bash
# Backup current build
docker cp youtube-clone-frontend-prod:/usr/share/nginx/html ./backup

# Restore from backup
docker cp ./backup youtube-clone-frontend-prod:/usr/share/nginx/html
```

## 🎯 Next Steps

1. **Connect to Backend**: Update the API URL in your environment variables
2. **Custom Domain**: Configure nginx for your domain
3. **SSL Certificate**: Add HTTPS support
4. **Monitoring**: Set up health checks and monitoring
5. **CI/CD**: Integrate with your deployment pipeline

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [React Build Optimization](https://create-react-app.dev/docs/production-build/)
- [Docker Compose Reference](https://docs.docker.com/compose/)

---

Happy coding! 🚀
