@echo off
REM AgriShare Platform Setup Script for Windows
REM This script sets up the complete AgriShare platform

echo 🌱 Setting up AgriShare Platform...
echo.

REM Check if Node.js is installed
echo ================================
echo Checking Node.js Installation
echo ================================

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 14 or higher.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [INFO] Node.js is installed: %NODE_VERSION%

REM Check if MongoDB is installed
echo.
echo ================================
echo Checking MongoDB Installation
echo ================================

mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] MongoDB is not installed locally.
    echo You can use MongoDB Atlas (cloud) or install MongoDB locally
    echo MongoDB Atlas: https://cloud.mongodb.com/
    echo Local MongoDB: https://docs.mongodb.com/manual/installation/
) else (
    echo [INFO] MongoDB is installed
)

REM Setup backend
echo.
echo ================================
echo Setting up Backend
echo ================================

cd backend

echo [INFO] Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)
echo [INFO] Backend dependencies installed successfully

REM Create .env file if it doesn't exist
if not exist .env (
    echo [INFO] Creating .env file...
    (
        echo MONGO_URI=mongodb://localhost:27017/agrishare
        echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-%RANDOM%
        echo PORT=5000
        echo NODE_ENV=development
    ) > .env
    echo [INFO] .env file created with default values
    echo [WARNING] Please update JWT_SECRET in .env file for production
) else (
    echo [INFO] .env file already exists
)

cd ..

REM Setup frontend
echo.
echo ================================
echo Setting up Frontend
echo ================================

cd my-app

echo [INFO] Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)
echo [INFO] Frontend dependencies installed successfully

cd ..

REM Create startup scripts
echo.
echo ================================
echo Creating Startup Scripts
echo ================================

REM Backend startup script
(
    echo @echo off
    echo echo 🚀 Starting AgriShare Backend...
    echo cd backend
    echo call npm run dev
    echo pause
) > start-backend.bat

REM Frontend startup script
(
    echo @echo off
    echo echo 🚀 Starting AgriShare Frontend...
    echo cd my-app
    echo call npm run dev
    echo pause
) > start-frontend.bat

REM Full startup script
(
    echo @echo off
    echo echo 🌱 Starting AgriShare Platform...
    echo.
    echo echo Starting backend...
    echo start "AgriShare Backend" cmd /k "cd backend && npm run dev"
    echo.
    echo timeout /t 3 /nobreak ^>nul
    echo.
    echo echo Starting frontend...
    echo start "AgriShare Frontend" cmd /k "cd my-app && npm run dev"
    echo.
    echo echo ✅ AgriShare Platform is starting...
    echo echo Backend: http://localhost:5000
    echo echo Frontend: http://localhost:5173
    echo echo.
    echo echo Press any key to exit...
    echo pause ^>nul
) > start-all.bat

echo [INFO] Startup scripts created:
echo   - start-backend.bat (backend only)
echo   - start-frontend.bat (frontend only)
echo   - start-all.bat (both services)

REM Setup complete
echo.
echo ================================
echo Setup Complete! 🎉
echo ================================
echo.
echo [INFO] Next steps:
echo 1. Start MongoDB (if using local installation)
echo 2. Run: start-all.bat (to start both backend and frontend)
echo    Or run: start-backend.bat and start-frontend.bat separately
echo.
echo [INFO] Access the application:
echo   Frontend: http://localhost:5173
echo   Backend API: http://localhost:5000
echo.
echo [INFO] Create your first admin account:
echo 1. Go to http://localhost:5173/signup
echo 2. Select 'Admin' as your role
echo 3. Complete the registration form
echo.
echo [INFO] Documentation:
echo   - README.md (main documentation)
echo   - API_DOCUMENTATION.md (API reference)
echo   - QUICK_START.md (quick start guide)
echo.
echo [INFO] Happy farming! 🌱
echo.
pause
