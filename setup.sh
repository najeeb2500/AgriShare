#!/bin/bash

# AgriShare Platform Setup Script
# This script sets up the complete AgriShare platform

echo "🌱 Setting up AgriShare Platform..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Check if Node.js is installed
check_nodejs() {
    print_header "Checking Node.js Installation"
    
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_status "Node.js is installed: $NODE_VERSION"
        
        # Check if version is 14 or higher
        NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$NODE_MAJOR_VERSION" -ge 14 ]; then
            print_status "Node.js version is compatible (>= 14)"
        else
            print_error "Node.js version must be 14 or higher. Please update Node.js."
            exit 1
        fi
    else
        print_error "Node.js is not installed. Please install Node.js 14 or higher."
        print_status "Download from: https://nodejs.org/"
        exit 1
    fi
}

# Check if MongoDB is installed
check_mongodb() {
    print_header "Checking MongoDB Installation"
    
    if command -v mongod &> /dev/null; then
        print_status "MongoDB is installed"
        
        # Check if MongoDB is running
        if pgrep -x "mongod" > /dev/null; then
            print_status "MongoDB is running"
        else
            print_warning "MongoDB is not running. Starting MongoDB..."
            if command -v systemctl &> /dev/null; then
                sudo systemctl start mongod
            elif command -v brew &> /dev/null; then
                brew services start mongodb-community
            else
                print_warning "Please start MongoDB manually"
            fi
        fi
    else
        print_warning "MongoDB is not installed locally."
        print_status "You can use MongoDB Atlas (cloud) or install MongoDB locally"
        print_status "MongoDB Atlas: https://cloud.mongodb.com/"
        print_status "Local MongoDB: https://docs.mongodb.com/manual/installation/"
    fi
}

# Setup backend
setup_backend() {
    print_header "Setting up Backend"
    
    cd backend
    
    print_status "Installing backend dependencies..."
    npm install
    
    if [ $? -eq 0 ]; then
        print_status "Backend dependencies installed successfully"
    else
        print_error "Failed to install backend dependencies"
        exit 1
    fi
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        print_status "Creating .env file..."
        cat > .env << EOF
MONGO_URI=mongodb://localhost:27017/agrishare
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-$(date +%s)
PORT=5000
NODE_ENV=development
EOF
        print_status ".env file created with default values"
        print_warning "Please update JWT_SECRET in .env file for production"
    else
        print_status ".env file already exists"
    fi
    
    cd ..
}

# Setup frontend
setup_frontend() {
    print_header "Setting up Frontend"
    
    cd my-app
    
    print_status "Installing frontend dependencies..."
    npm install
    
    if [ $? -eq 0 ]; then
        print_status "Frontend dependencies installed successfully"
    else
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
    
    cd ..
}

# Create startup scripts
create_startup_scripts() {
    print_header "Creating Startup Scripts"
    
    # Backend startup script
    cat > start-backend.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting AgriShare Backend..."
cd backend
npm run dev
EOF
    chmod +x start-backend.sh
    
    # Frontend startup script
    cat > start-frontend.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting AgriShare Frontend..."
cd my-app
npm run dev
EOF
    chmod +x start-frontend.sh
    
    # Full startup script
    cat > start-all.sh << 'EOF'
#!/bin/bash
echo "🌱 Starting AgriShare Platform..."

# Start backend in background
echo "Starting backend..."
cd backend
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "Starting frontend..."
cd ../my-app
npm run dev &
FRONTEND_PID=$!

echo "✅ AgriShare Platform is starting..."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
wait $BACKEND_PID $FRONTEND_PID
EOF
    chmod +x start-all.sh
    
    print_status "Startup scripts created:"
    print_status "  - start-backend.sh (backend only)"
    print_status "  - start-frontend.sh (frontend only)"
    print_status "  - start-all.sh (both services)"
}

# Test installation
test_installation() {
    print_header "Testing Installation"
    
    # Test backend
    print_status "Testing backend..."
    cd backend
    timeout 10s npm run dev > /dev/null 2>&1 &
    BACKEND_PID=$!
    sleep 5
    
    if curl -s http://localhost:5000 > /dev/null; then
        print_status "✅ Backend is working"
    else
        print_warning "⚠️  Backend test failed (this might be normal if MongoDB is not running)"
    fi
    
    kill $BACKEND_PID 2>/dev/null
    cd ..
    
    print_status "Installation test completed"
}

# Main setup function
main() {
    print_header "AgriShare Platform Setup"
    print_status "This script will set up the complete AgriShare platform"
    echo ""
    
    # Check prerequisites
    check_nodejs
    check_mongodb
    
    # Setup components
    setup_backend
    setup_frontend
    create_startup_scripts
    test_installation
    
    print_header "Setup Complete! 🎉"
    echo ""
    print_status "Next steps:"
    echo "1. Start MongoDB (if using local installation)"
    echo "2. Run: ./start-all.sh (to start both backend and frontend)"
    echo "   Or run: ./start-backend.sh and ./start-frontend.sh separately"
    echo ""
    print_status "Access the application:"
    echo "  Frontend: http://localhost:5173"
    echo "  Backend API: http://localhost:5000"
    echo ""
    print_status "Create your first admin account:"
    echo "1. Go to http://localhost:5173/signup"
    echo "2. Select 'Admin' as your role"
    echo "3. Complete the registration form"
    echo ""
    print_status "Documentation:"
    echo "  - README.md (main documentation)"
    echo "  - API_DOCUMENTATION.md (API reference)"
    echo "  - QUICK_START.md (quick start guide)"
    echo ""
    print_status "Happy farming! 🌱"
}

# Run main function
main "$@"
