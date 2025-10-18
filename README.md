# AgriShare - Community Gardening and Land Sharing Platform

🌱 **AgriShare** is a community-driven gardening platform that connects landowners, gardeners, volunteers, and agriculture experts under a single ecosystem to promote sustainable agriculture, community engagement, and local food production.

## 🎯 Project Vision

> "To create a sustainable and collaborative agricultural ecosystem where communities grow together by sharing land, knowledge, and effort."

## 👥 User Roles & Responsibilities

### 🏠 **Landowner**
- Registers land details and location
- Shares unused land for community farming
- Monitors gardening activities on their land

### 🌱 **Gardener**
- Registers as a worker or cultivator
- Receives land allocations from the admin
- Updates farming progress and yield details

### 🤝 **Volunteer**
- Acts as a guide, coordinator, or project manager
- Helps connect landowners, gardeners, and experts
- Manages on-ground community activities

### 🎓 **Expert**
- Provides agricultural advice, crop suggestions, and training
- Monitors soil, water, and crop conditions
- Offers reports and improvement strategies

### 👨‍💼 **Admin (Authority/Panchayath)**
- Reviews and approves user registrations
- Allocates land to gardeners
- Oversees the overall project, manages reports, and ensures smooth functioning

## 🌾 Core Features

- ✅ **Multi-user registration** with role-based dashboards
- ✅ **Admin approval system** for all user registrations
- ✅ **Land sharing module** for owners to post available land
- ✅ **Task and work allocation** system managed by admin
- ✅ **Progress tracking and reporting** for gardeners, volunteers, and experts
- ✅ **Community updates** to share knowledge, events, and produce sales
- ✅ **Marketplace integration** for selling fresh produce directly to consumers

## 🚀 Tech Stack

- **Frontend**: React (Vite) + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Tailwind CSS

## 📁 Project Structure

```
AgriShare/
├── backend/
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── landController.js
│   │   ├── taskController.js
│   │   ├── progressController.js
│   │   └── communityController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Land.js
│   │   ├── Task.js
│   │   ├── Progress.js
│   │   └── Community.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── landRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── progressRoutes.js
│   │   └── communityRoutes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── my-app/
│   ├── src/
│   │   ├── components/
│   │   │   └── dashboard/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── GardenerDashboard.jsx
│   │   │       ├── LandownerDashboard.jsx
│   │   │       ├── VolunteerDashboard.jsx
│   │   │       └── ExpertDashboard.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   # Create .env file in backend directory
   MONGO_URI=mongodb://localhost:27017/agrishare
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd my-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔐 Authentication & Authorization

The platform uses JWT-based authentication with role-based access control:

- **Public Routes**: User registration, login
- **Protected Routes**: All dashboard and feature access
- **Role-based Access**: Different permissions for each user role
- **Admin Approval**: All users (except admin) require approval before full access

## 📊 API Endpoints

### User Management
- `POST /api/users` - Register new user
- `POST /api/users/userlogin` - User login
- `GET /api/users/pending-users` - Get pending approvals (Admin only)
- `PUT /api/users/approve-user/:userId` - Approve user (Admin only)
- `GET /api/profile/:userId` - Get user profile

### Land Management
- `GET /api/lands/available` - Get available lands
- `POST /api/lands` - Create land listing (Landowner only)
- `GET /api/lands/:id` - Get land details
- `PUT /api/lands/:landId/allocate` - Allocate land (Admin only)

### Task Management
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task (Admin/Volunteer)
- `GET /api/tasks/user/:userId` - Get user's tasks
- `PUT /api/tasks/:taskId/status` - Update task status

### Progress Tracking
- `GET /api/progress` - Get progress records
- `POST /api/progress` - Create progress record (Gardener)
- `POST /api/progress/:progressId/activity` - Add activity
- `POST /api/progress/:progressId/expert-advice` - Add expert advice

### Community Features
- `GET /api/community` - Get community posts
- `POST /api/community` - Create post
- `GET /api/community/marketplace` - Get marketplace items
- `POST /api/community/:postId/like` - Like post

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Interface**: Clean, intuitive design with Tailwind CSS
- **Role-based Dashboards**: Customized experience for each user type
- **Real-time Updates**: Dynamic content updates
- **Accessibility**: WCAG compliant design

## 🔄 User Flow

1. **Registration**: Users register with role-specific information
2. **Admin Approval**: Admin reviews and approves/rejects registrations
3. **Dashboard Access**: Approved users access role-specific dashboards
4. **Land Sharing**: Landowners list available lands
5. **Land Allocation**: Admin allocates lands to gardeners
6. **Task Management**: Tasks are created and assigned
7. **Progress Tracking**: Gardeners update farming progress
8. **Community Engagement**: Users share updates and knowledge
9. **Marketplace**: Direct selling of produce

## 🚧 Development Status

### ✅ Completed Features
- User registration and authentication system
- Admin approval workflow
- Role-based dashboards for all user types
- Land management system
- Task allocation system
- Progress tracking framework
- Community features structure
- JWT-based authentication
- Responsive UI design

### 🚧 In Progress
- Marketplace functionality
- Advanced progress tracking
- Community features implementation
- Data validation and error handling

### 📋 Future Enhancements
- Real-time notifications
- Mobile app development
- Advanced analytics and reporting
- Integration with weather APIs
- Payment gateway integration
- Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@agrishare.com or join our community forum.

## 🙏 Acknowledgments

- Community gardening initiatives worldwide
- Open source contributors
- Sustainable agriculture advocates

---

**Built with ❤️ for sustainable agriculture and community growth**
