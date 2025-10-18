# AgriShare API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format
All API responses follow this format:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

Error responses:
```json
{
  "success": false,
  "status": "error",
  "message": "Error message",
  "errors": [ ... ] // For validation errors
}
```

---

## User Management

### Register User
**POST** `/users`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "gardener",
  "phone": "+91 9876543210",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "bio": "Passionate gardener",
  "experience": "5 years of farming experience",
  "skills": ["organic farming", "crop rotation"]
}
```

**Response:**
```json
{
  "message": "User registration submitted for approval",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "role": "gardener",
    "email": "john@example.com",
    "isApproved": false
  }
}
```

### Login User
**POST** `/users/userlogin`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "role": "gardener",
    "email": "john@example.com",
    "isApproved": true
  }
}
```

### Get Pending Users (Admin Only)
**GET** `/users/pending-users`

**Headers:** `Authorization: Bearer <admin-token>`

**Response:**
```json
[
  {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "gardener",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Approve User (Admin Only)
**PUT** `/users/approve-user/:userId`

**Headers:** `Authorization: Bearer <admin-token>`

**Body:**
```json
{
  "adminId": "admin_user_id"
}
```

### Get User Profile
**GET** `/users/profile/:userId`

**Headers:** `Authorization: Bearer <token>`

---

## Land Management

### Get Available Lands
**GET** `/lands/available`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `city` (optional): Filter by city
- `state` (optional): Filter by state
- `minArea` (optional): Minimum area
- `maxArea` (optional): Maximum area
- `soilType` (optional): Soil type filter

**Response:**
```json
{
  "lands": [
    {
      "_id": "land_id",
      "title": "Organic Farm Land",
      "description": "Perfect for organic farming",
      "area": {
        "total": 5,
        "unit": "acres",
        "available": 3
      },
      "location": {
        "address": {
          "city": "Mumbai",
          "state": "Maharashtra"
        }
      },
      "soilType": "loamy",
      "landowner": {
        "name": "Land Owner",
        "email": "owner@example.com"
      }
    }
  ],
  "totalPages": 1,
  "currentPage": 1,
  "total": 1
}
```

### Create Land Listing (Landowner Only)
**POST** `/lands`

**Headers:** `Authorization: Bearer <landowner-token>`

**Body:**
```json
{
  "title": "Organic Farm Land",
  "description": "Perfect for organic farming with good water source",
  "location": {
    "address": {
      "street": "Farm Road 1",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001"
    },
    "coordinates": {
      "latitude": 19.0760,
      "longitude": 72.8777
    }
  },
  "area": {
    "total": 5,
    "unit": "acres",
    "available": 5
  },
  "soilType": "loamy",
  "waterSource": "well",
  "irrigation": "drip",
  "terms": {
    "duration": 12,
    "cost": 0,
    "costType": "free",
    "conditions": "Must follow organic farming practices"
  }
}
```

### Allocate Land (Admin Only)
**PUT** `/lands/:landId/allocate`

**Headers:** `Authorization: Bearer <admin-token>`

**Body:**
```json
{
  "gardenerId": "gardener_user_id",
  "adminId": "admin_user_id"
}
```

---

## Task Management

### Get Tasks
**GET** `/tasks`

**Query Parameters:**
- `page`, `limit`: Pagination
- `status`: Filter by status (pending, in_progress, completed, cancelled, on_hold)
- `priority`: Filter by priority (low, medium, high, urgent)
- `category`: Filter by category
- `assignedTo`: Filter by assigned user
- `landId`: Filter by land

**Response:**
```json
{
  "tasks": [
    {
      "_id": "task_id",
      "title": "Plant Tomato Seeds",
      "description": "Plant tomato seeds in allocated land",
      "category": "planting",
      "priority": "medium",
      "status": "pending",
      "dueDate": "2024-02-01T00:00:00.000Z",
      "estimatedDuration": 4,
      "land": {
        "title": "Organic Farm Land"
      },
      "assignedTo": {
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

### Create Task (Admin/Volunteer Only)
**POST** `/tasks`

**Headers:** `Authorization: Bearer <admin-or-volunteer-token>`

**Body:**
```json
{
  "title": "Plant Tomato Seeds",
  "description": "Plant tomato seeds in allocated land",
  "land": "land_id",
  "assignedTo": "gardener_user_id",
  "category": "planting",
  "priority": "medium",
  "dueDate": "2024-02-01T00:00:00.000Z",
  "estimatedDuration": 4,
  "instructions": "Use organic seeds and follow spacing guidelines"
}
```

### Update Task Status
**PUT** `/tasks/:taskId/status`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "status": "in_progress",
  "notes": "Started planting seeds",
  "images": ["image_url_1", "image_url_2"]
}
```

---

## Progress Tracking

### Create Progress Record (Gardener Only)
**POST** `/progress`

**Headers:** `Authorization: Bearer <gardener-token>`

**Body:**
```json
{
  "land": "land_id",
  "crop": {
    "name": "Tomato",
    "variety": "Cherry",
    "plantingDate": "2024-01-15T00:00:00.000Z",
    "expectedHarvestDate": "2024-04-15T00:00:00.000Z"
  },
  "growthStage": "planting",
  "yield": {
    "expected": {
      "quantity": 100,
      "unit": "kg"
    }
  }
}
```

### Add Activity to Progress
**POST** `/progress/:progressId/activity`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "type": "watering",
  "description": "Watered the plants",
  "duration": 2,
  "notes": "Used drip irrigation system",
  "images": ["activity_image_url"]
}
```

### Add Expert Advice (Expert Only)
**POST** `/progress/:progressId/expert-advice`

**Headers:** `Authorization: Bearer <expert-token>`

**Body:**
```json
{
  "advice": "Increase watering frequency during flowering stage",
  "implemented": false
}
```

---

## Community Features

### Get Community Posts
**GET** `/community`

**Query Parameters:**
- `page`, `limit`: Pagination
- `type`: Filter by type (update, tip, question, event, success_story, announcement, marketplace)
- `category`: Filter by category
- `tags`: Filter by tags
- `authorId`: Filter by author
- `search`: Search in title and content

**Response:**
```json
{
  "posts": [
    {
      "_id": "post_id",
      "title": "Organic Farming Tips",
      "content": "Here are some tips for organic farming...",
      "type": "tip",
      "category": "farming",
      "tags": ["organic", "farming", "tips"],
      "author": {
        "name": "Expert User",
        "email": "expert@example.com"
      },
      "likes": [],
      "comments": [],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Create Post
**POST** `/community`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "title": "Organic Farming Tips",
  "content": "Here are some tips for organic farming...",
  "type": "tip",
  "category": "farming",
  "tags": ["organic", "farming", "tips"]
}
```

### Like Post
**POST** `/community/:postId/like`

**Headers:** `Authorization: Bearer <token>`

### Add Comment
**POST** `/community/:postId/comment`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "content": "Great tips! Thanks for sharing."
}
```

---

## Marketplace

### Get Marketplace Listings
**GET** `/marketplace`

**Query Parameters:**
- `page`, `limit`: Pagination
- `category`: Filter by category (vegetables, fruits, grains, herbs, seeds, tools, fertilizers, other)
- `minPrice`, `maxPrice`: Price range
- `location`: Filter by location
- `search`: Search in product name and description
- `sortBy`: Sort field (createdAt, price, rating)
- `sortOrder`: Sort order (asc, desc)

**Response:**
```json
{
  "listings": [
    {
      "_id": "listing_id",
      "product": {
        "name": "Organic Tomatoes",
        "description": "Fresh organic tomatoes from local farm",
        "category": "vegetables",
        "quantity": 50,
        "unit": "kg",
        "price": 100
      },
      "seller": {
        "name": "Farmer John",
        "email": "john@example.com"
      },
      "availability": {
        "status": "available",
        "availableQuantity": 50
      },
      "quality": {
        "grade": "premium",
        "certification": ["organic"]
      },
      "statistics": {
        "averageRating": 4.5,
        "totalSold": 200
      }
    }
  ]
}
```

### Create Marketplace Listing
**POST** `/marketplace`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "product": {
    "name": "Organic Tomatoes",
    "description": "Fresh organic tomatoes from local farm",
    "category": "vegetables",
    "quantity": 50,
    "unit": "kg",
    "price": 100
  },
  "contact": {
    "phone": "+91 9876543210",
    "email": "john@example.com",
    "address": {
      "street": "Farm Road 1",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001"
    }
  },
  "location": {
    "name": "Mumbai Farm",
    "coordinates": {
      "latitude": 19.0760,
      "longitude": 72.8777
    },
    "pickupAvailable": true,
    "deliveryAvailable": true,
    "deliveryCharges": 20
  },
  "quality": {
    "grade": "premium",
    "certification": ["organic"],
    "harvestDate": "2024-01-15T00:00:00.000Z"
  }
}
```

### Create Order
**POST** `/marketplace/:listingId/order`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "quantity": 5,
  "deliveryAddress": {
    "street": "123 Buyer Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400002"
  },
  "notes": "Please deliver in the morning"
}
```

### Add Review
**POST** `/marketplace/:listingId/review`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "rating": 5,
  "comment": "Excellent quality tomatoes, very fresh!"
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation failed |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

---

## Rate Limiting

- **General API**: 100 requests per 15 minutes per IP
- **Authentication**: 5 login attempts per 15 minutes per IP
- **Registration**: 3 registrations per hour per IP

---

## Webhooks (Future Implementation)

The API will support webhooks for:
- User approval notifications
- Task assignment notifications
- Order status updates
- Community post interactions

---

## SDKs and Libraries

### JavaScript/Node.js
```bash
npm install axios
```

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Python
```bash
pip install requests
```

```python
import requests

headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}

response = requests.get('http://localhost:5000/api/users/profile/user_id', headers=headers)
```

---

## Support

For API support and questions:
- Email: api-support@agrishare.com
- Documentation: https://docs.agrishare.com
- Status Page: https://status.agrishare.com
