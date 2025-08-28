# 🐳 Backend Server Docker Setup

This guide explains how to use Docker with your Node.js YouTube clone backend server, configured for MongoDB Cloud.

## 📁 Files Created

- `Dockerfile` - Production build with security optimizations
- `Dockerfile.dev` - Development environment with hot reload
- `docker-compose.yml` - Orchestration for both dev and prod
- `nginx/nginx.conf` - Nginx configuration for production
- `.dockerignore` - Excludes unnecessary files from build
- `deploy.sh` - Automated deployment script with MongoDB testing

## 🚀 Quick Start

### Option 1: Using the Deployment Script (Recommended)

```bash
# Make the script executable
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

The script will present you with options:
1. **Development deployment** (port 8080)
2. **Production deployment** (with nginx)
3. **Build Docker image only**
4. **Test MongoDB connection**
5. **Show logs**
6. **Cleanup containers and images**

### Option 2: Manual Docker Commands

#### Development Environment
```bash
# Build and run development container
docker-compose up -d backend-dev

# View logs
docker-compose logs -f backend-dev

# Stop development container
docker-compose down
```

#### Production Environment
```bash
# Build and run production container with nginx
docker-compose up -d backend-prod nginx

# View logs
docker-compose logs -f backend-prod

# Stop production container
docker-compose down
```

#### Build Only
```bash
# Build production image
docker build -t youtube-clone-backend .

# Build development image
docker build -f Dockerfile.dev -t youtube-clone-backend:dev .
```

## 🔧 Configuration

### Environment Variables (.env file)

Create a `.env` file in the server-side directory:

```env
# MongoDB Cloud Configuration
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/youtube-clone?retryWrites=true&w=majority

# JWT Authentication
ACCESS_TOKEN_SECRET=your_super_secure_access_token_secret_here
REFRESH_TOKEN_SECRET=your_super_secure_refresh_token_secret_here
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=40d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server Configuration
NODE_ENV=production
PORT=8080
```

### MongoDB Cloud Setup

1. **Create MongoDB Atlas Account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free account
   - Create a new cluster

2. **Get Connection String:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<username>`, `<password>`, and `<dbname>` with your values

3. **Network Access:**
   - Go to Network Access
   - Add your IP address or `0.0.0.0/0` for all IPs

### Cloudinary Setup

1. **Create Cloudinary Account:**
   - Go to [Cloudinary](https://cloudinary.com/)
   - Create a free account
   - Get your credentials from the dashboard

2. **Configure Environment:**
   - Copy your Cloud Name, API Key, and API Secret
   - Add them to your `.env` file

## 🌐 Access Points

### Development
- **API Base URL**: http://localhost:8080/api/v1
- **Health Check**: http://localhost:8080/health
- **Hot Reload**: ✅ Enabled
- **Debug Mode**: ✅ Enabled

### Production
- **API Base URL**: http://localhost/api/v1
- **Direct Backend**: http://localhost:8080/api/v1
- **Health Check**: http://localhost/health
- **Nginx Proxy**: ✅ Enabled
- **Security Headers**: ✅ Enabled

## 🔍 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   ```bash
   # Test MongoDB connection
   ./deploy.sh
   # Choose option 4: Test MongoDB connection
   
   # Check connection string format
   # Ensure network access is configured in MongoDB Atlas
   ```

2. **Port Already in Use**
   ```bash
   # Check what's using the port
   lsof -i :8080
   lsof -i :80
   
   # Kill the process or change ports in docker-compose.yml
   ```

3. **Environment Variables Not Loading**
   ```bash
   # Check if .env file exists
   ls -la .env
   
   # Verify environment variables in container
   docker-compose exec backend-prod env | grep MONGODB
   ```

4. **Cloudinary Upload Issues**
   ```bash
   # Check Cloudinary credentials
   docker-compose exec backend-prod env | grep CLOUDINARY
   
   # Test Cloudinary connection
   # Verify file size limits
   ```

### Debug Commands

```bash
# Check container status
docker ps

# View container logs
docker logs youtube-clone-backend-dev
docker logs youtube-clone-backend-prod

# Access container shell
docker exec -it youtube-clone-backend-dev sh
docker exec -it youtube-clone-backend-prod sh

# Check nginx configuration
docker exec -it youtube-clone-backend-nginx nginx -t

# Monitor resource usage
docker stats
```

## 📊 Performance Features

### Production Optimizations
- ✅ Multi-stage build (smaller image size)
- ✅ Non-root user for security
- ✅ Health checks
- ✅ Signal handling with dumb-init
- ✅ Nginx reverse proxy
- ✅ Gzip compression
- ✅ Security headers
- ✅ Resource limits

### Development Features
- ✅ Hot reload with nodemon
- ✅ Volume mounting for live code changes
- ✅ Debug mode enabled
- ✅ Source maps for debugging

## 🔒 Security Features

### Container Security
- ✅ Non-root user execution
- ✅ Signal handling with dumb-init
- ✅ Minimal base image (Alpine)
- ✅ Security headers in nginx
- ✅ Environment variable isolation

### API Security
- ✅ JWT authentication
- ✅ CORS configuration
- ✅ Input validation
- ✅ Rate limiting (can be added)
- ✅ HTTPS ready

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
docker-compose up -d --build backend-prod
```

### Database Backups
```bash
# MongoDB Cloud has automatic backups
# For manual backups, use MongoDB Atlas dashboard
# Or use mongodump with your connection string
```

### Monitoring
```bash
# Check container health
docker ps

# Monitor logs
docker-compose logs -f

# Check resource usage
docker stats

# Health check endpoint
curl http://localhost/health
```

## 🎯 API Endpoints

### Authentication
- `POST /api/v1/users/register` - Register new user
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/logout` - User logout
- `POST /api/v1/users/refresh-token` - Refresh access token

### Users
- `GET /api/v1/users/find/:id` - Get user by ID
- `PATCH /api/v1/users/update-account` - Update user account
- `DELETE /api/v1/users/delete-user` - Delete user account

### Videos
- `POST /api/v1/videos` - Upload video
- `GET /api/v1/videos/find/:id` - Get video by ID
- `PUT /api/v1/videos/:id` - Update video
- `DELETE /api/v1/videos/:id` - Delete video
- `GET /api/v1/videos/random` - Get random videos
- `GET /api/v1/videos/trend` - Get trending videos
- `GET /api/v1/videos/search` - Search videos

### Comments
- `POST /api/v1/comments` - Add comment
- `DELETE /api/v1/comments/:id` - Delete comment
- `GET /api/v1/comments/:videoId` - Get video comments

## 🎯 Next Steps

1. **Connect Frontend**: Update frontend API URL to point to your backend
2. **Custom Domain**: Configure nginx for your domain
3. **SSL Certificate**: Add HTTPS support with Let's Encrypt
4. **Monitoring**: Set up application monitoring (PM2, New Relic, etc.)
5. **CI/CD**: Integrate with your deployment pipeline
6. **Scaling**: Set up load balancing and horizontal scaling

## 📚 Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)

---

Happy coding! 🚀
