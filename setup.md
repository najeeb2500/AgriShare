# AgriShare Setup Guide

## Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with the following content:
cat > .env << EOF
MONGO_URI=mongodb://localhost:27017/agrishare
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
EOF

# Start the backend server
npm run dev
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd my-app

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

### 3. Database Setup

Make sure MongoDB is running on your system:

```bash
# For local MongoDB installation
mongod

# Or if using MongoDB Atlas, update the MONGO_URI in .env file
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## Testing the Application

1. **Register a new user** at http://localhost:5173/signup
2. **Login as admin** (if you created an admin account)
3. **Approve pending users** from the admin dashboard
4. **Test different user roles** and their respective dashboards

## Default Admin Account

To create an admin account for testing:

1. Go to the signup page
2. Select "Admin" as the role
3. Complete the registration form
4. Admin accounts are automatically approved

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the MONGO_URI in .env file
   - Verify database permissions

2. **Port Already in Use**
   - Change the PORT in .env file
   - Kill existing processes using the port

3. **CORS Issues**
   - Ensure backend is running on port 5000
   - Check CORS configuration in server.js

4. **JWT Token Issues**
   - Verify JWT_SECRET is set in .env
   - Check token expiration settings

### Getting Help

- Check the console for error messages
- Verify all dependencies are installed
- Ensure all environment variables are set correctly
