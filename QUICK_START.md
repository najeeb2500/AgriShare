# AgriShare - Quick Start Guide

## 🚀 Complete Setup in 5 Minutes

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Git

### 1. Clone and Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
echo "MONGO_URI=mongodb://localhost:27017/agrishare
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development" > .env

# Start the backend server
npm run dev
```

### 2. Setup Frontend

```bash
# In a new terminal, navigate to frontend directory
cd my-app

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

### 3. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Documentation**: See API_DOCUMENTATION.md

### 4. Create Your First Admin Account

1. Go to http://localhost:5173/signup
2. Select "Admin" as your role
3. Fill in the registration form
4. Admin accounts are automatically approved

### 5. Test the Platform

1. **Login** with your admin account
2. **Create test users** with different roles:
   - Gardener
   - Landowner
   - Volunteer
   - Expert
3. **Approve users** from the admin dashboard
4. **Test features**:
   - Land sharing (Landowner)
   - Task management (Admin/Volunteer)
   - Progress tracking (Gardener)
   - Expert advice (Expert)
   - Marketplace listings
   - Community posts

## 🎯 Key Features to Test

### Admin Dashboard
- ✅ User approval system
- ✅ System statistics
- ✅ Land allocation
- ✅ Task management

### Landowner Features
- ✅ Land listing creation
- ✅ Land management
- ✅ Allocation monitoring

### Gardener Features
- ✅ Available land browsing
- ✅ Task management
- ✅ Progress tracking
- ✅ Marketplace access

### Volunteer Features
- ✅ Task volunteering
- ✅ Community coordination
- ✅ Progress monitoring

### Expert Features
- ✅ Advice provision
- ✅ Progress analysis
- ✅ Knowledge sharing

### Community Features
- ✅ Post creation and sharing
- ✅ Like and comment system
- ✅ Event management
- ✅ Knowledge exchange

### Marketplace Features
- ✅ Product listing
- ✅ Order management
- ✅ Review system
- ✅ Location-based search

## 🔧 Troubleshooting

### Common Issues

**MongoDB Connection Error**
```bash
# Start MongoDB service
sudo systemctl start mongod
# Or on Windows
net start MongoDB
```

**Port Already in Use**
```bash
# Kill process using port 5000
lsof -ti:5000 | xargs kill -9
# Or change PORT in .env file
```

**CORS Issues**
- Ensure backend is running on port 5000
- Check CORS configuration in server.js

**JWT Token Issues**
- Verify JWT_SECRET is set in .env
- Check token expiration settings

### Database Setup

**Local MongoDB**
```bash
# Create database
mongo
use agrishare
```

**MongoDB Atlas (Cloud)**
1. Create account at https://cloud.mongodb.com
2. Create cluster
3. Get connection string
4. Update MONGO_URI in .env

## 📱 Mobile Responsiveness

The platform is fully responsive and works on:
- ✅ Desktop computers
- ✅ Tablets
- ✅ Mobile phones
- ✅ All modern browsers

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control
- ✅ Input validation and sanitization
- ✅ Rate limiting
- ✅ Security headers
- ✅ CORS protection

## 📊 Performance Features

- ✅ Database indexing
- ✅ Pagination for large datasets
- ✅ Image optimization
- ✅ Lazy loading
- ✅ Caching strategies

## 🌐 Production Deployment

### Backend Deployment
```bash
# Build for production
npm run build

# Set production environment variables
NODE_ENV=production
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy dist folder to your hosting service
```

### Recommended Hosting
- **Backend**: Heroku, DigitalOcean, AWS
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Database**: MongoDB Atlas, AWS DocumentDB

## 📈 Monitoring and Analytics

### Built-in Features
- ✅ Request logging
- ✅ Error tracking
- ✅ Performance monitoring
- ✅ User activity tracking

### Recommended Tools
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics
- **Monitoring**: New Relic, DataDog
- **Logs**: Winston, Morgan

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

- **Documentation**: README.md, API_DOCUMENTATION.md
- **Issues**: GitHub Issues
- **Community**: Discord/Slack (coming soon)

## 🎉 Congratulations!

You now have a fully functional AgriShare platform running locally! 

### Next Steps:
1. **Customize** the platform for your specific needs
2. **Add** your own branding and styling
3. **Deploy** to production
4. **Invite** users to join your community
5. **Scale** as your community grows

### Platform Capabilities:
- 🌱 **Land Sharing**: Connect landowners with gardeners
- 👥 **Community Building**: Foster knowledge sharing
- 📊 **Progress Tracking**: Monitor farming activities
- 🛒 **Marketplace**: Direct produce sales
- 🎯 **Task Management**: Organize community work
- 🎓 **Expert Guidance**: Agricultural knowledge sharing

**Happy Farming! 🌾**
