# 🏫 School Management API

A Node.js REST API for managing school data with location‑based sorting using the Haversine formula.

---

## 🚀 Live Demo

* **Base URL**: `https://school-managment-api-production.up.railway.app/health`

**Endpoints**

| Method | Path                             | Description                                      |
| -----: | -------------------------------- | ------------------------------------------------ |
|    GET | `/health`                        | Health check                                     |
|   POST | `/api/addSchool`                 | Add a new school                                 |
|    GET | `/api/listSchools?lat=..&lng=..` | List schools sorted by distance from coordinates |

> Replace `your-app.railway.app` with your actual Railway domain or custom domain.

---

## 📑 Table of Contents

* [Features](#-features)
* [Technology Stack](#%EF%B8%8F-technology-stack)
* [Getting Started (Local)](#-getting-started-local)

  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
  * [Environment Variables](#environment-variables)
  * [Database Setup](#database-setup)
  * [Run the Server](#run-the-server)
  * [Verify](#verify)
* [API Documentation](#-api-documentation)

  * [Health Check](#health-check)
  * [Add School](#add-school)
  * [List Schools (by distance)](#list-schools-by-distance)
* [Testing](#-testing)
* [Project Structure](#-project-structure)
* [Deployment (Railway)](#-deployment-railway)
* [Environment (Production)](#-environment-production)
* [API Response Examples](#-api-response-examples)
* [Contributing](#-contributing)
* [License](#-license)
* [Author](#-author)
* [Acknowledgments](#-acknowledgments)

---

## 📋 Features

* ✅ Add new schools with geographic coordinates
* ✅ Retrieve schools sorted by proximity to user location
* ✅ Comprehensive input validation and error handling
* ✅ Distance calculation using **Haversine** formula
* ✅ MySQL database integration with **connection pooling**
* ✅ RESTful API design with proper HTTP status codes

---

## 🛠️ Technology Stack

* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: MySQL
* **Validation**: Joi
* **Environment**: dotenv
* **Hosting**: Railway

---

## 🔧 Getting Started (Local)

### Prerequisites

* Node.js **v16+**
* MySQL Server
* Git

### Installation

```bash
# 1) Clone the repository
git clone https://github.com/DevolRaman750/school-managment-api.git
cd school-management-api

# 2) Install dependencies
npm install
```

### Environment Variables

Create a **.env** file in the project root:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=school_management
PORT=3000
NODE_ENV=development
```

> Tip: Commit a safe template as `.env.example` and **do not** commit your real `.env`.

### Database Setup

Create the database (and optionally the `schools` table):

```sql
CREATE DATABASE IF NOT EXISTS school_management;
USE school_management;

CREATE TABLE IF NOT EXISTS schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(500) NOT NULL,
  latitude DECIMAL(10,6) NOT NULL,
  longitude DECIMAL(10,6) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Run the Server

```bash
# Development mode (e.g., with nodemon)
npm run dev

# Production mode
npm start
```

### Verify

Open: [http://localhost:3000/health](http://localhost:3000/health)

---

## 📊 API Documentation

### Health Check

**GET** `/health`

**Response**: Server status and timestamp.

---

### Add School

**POST** `/api/addSchool`

**Headers**: `Content-Type: application/json`

**Request Body**

```json
{
  "name": "School Name",
  "address": "Complete Address",
  "latitude": 28.7041,
  "longitude": 77.1025
}
```

**Possible Status Codes**: `201`, `400` (validation), `500`

---

### List Schools (by distance)

**GET** `/api/listSchools?latitude=28.7041&longitude=77.1025`

**Query Parameters**

* `latitude` *(required)*: number between -90 and 90
* `longitude` *(required)*: number between -180 and 180

**Possible Status Codes**: `200`, `400` (validation), `500`

---

## 🧪 Testing

### Postman Collection

Include an exported Postman collection in your repo (e.g., `docs/postman/collection.json`) and link to it here:

**Collection**: *[Download School Management API Collection](https://www.postman.com/aerospace-operator-67234708/my-workspace/collection/682qwgw/school-managment-api?action=share&creator=37430865)*

**Includes**

* All API endpoints with examples
* Validation tests
* Error handling scenarios
* Automated test scripts

### Manual Testing (cURL)

```bash
# Health check
curl https://school-managment-api-production.up.railway.app/health

# Add school
curl -X POST https://school-managment-api-production.up.railway.app/api/addSchool \
  -H "Content-Type: application/json" \
  -d '{"name":"Test School","address":"Test Address","latitude":28.7041,"longitude":77.1025}'

# List schools
curl "https://school-managment-api-production.up.railway.app/api/listSchools?latitude=28.7041&longitude=77.1025"
```

---

## 📁 Project Structure

```
school-management-api/
├── config/
│   └── database.js           # Database connection & setup
├── controllers/
│   └── schoolController.js   # Business logic
├── routes/
│   └── schoolRoutes.js       # Route definitions
├── utils/
│   ├── validation.js         # Input validation schemas (Joi)
│   └── distanceCalculator.js # Geographic calculations (Haversine)
├── .env                      # Environment variables (local only)
├── .gitignore                # Git ignore rules
├── package.json              # Dependencies & scripts
├── server.js                 # Application entry point
└── README.md                 # Documentation
```

---

## 🌍 Deployment (Railway)

1. **Create a new Railway project** and add a **Web Service** (Node.js) from your GitHub repo.
2. Add a **MySQL** database (Railway Plugin) or connect an external MySQL instance.
3. Set **Environment Variables** in Railway → *Variables* (see below).
4. Ensure `npm start` is your start command and `PORT` is set (Railway injects `PORT`, respect it in your server code).
5. Deploy. Once built, copy the generated domain and update the **Base URL** above.

> Ensure your server binds to `0.0.0.0` and `process.env.PORT` in production.

---

## 🔐 Environment (Production)

```env
DB_HOST=containers-us-west-xxx.railway.app
DB_PORT=3306
DB_USER=root
DB_PASSWORD=generated_password
DB_NAME=railway
NODE_ENV=production
```

---

## 🔍 API Response Examples

### Successful School Addition

```json
{
  "success": true,
  "message": "School added successfully",
  "data": {
    "id": 1,
    "name": "Delhi Public School",
    "address": "123 Academic Street, New Delhi",
    "latitude": 28.7041,
    "longitude": 77.1025
  }
}
```

### Schools List with Distance

```json
{
  "success": true,
  "message": "Schools retrieved successfully",
  "userLocation": {
    "latitude": 28.7041,
    "longitude": 77.1025
  },
  "data": [
    {
      "id": 1,
      "name": "Delhi Public School",
      "address": "123 Academic Street, New Delhi",
      "latitude": 28.7041,
      "longitude": 77.1025,
      "distance": "0 km"
    },
    {
      "id": 2,
      "name": "Mumbai International School",
      "address": "456 Education Lane, Mumbai",
      "latitude": 19.0760,
      "longitude": 72.8777,
      "distance": "1159.22 km"
    }
  ]
}
```

### Validation Error

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    "School name is required",
    "Latitude must be between -90 and 90"
  ]
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m "Add amazing feature"`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📝 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Your Name**
GitHub: [(https://github.com/DevolRaman750)](https://github.com/DevolRaman750)
Email: [ramantripathi0707@gmail.com](ramantripathi0707@gmail.com)
LinkedIn: [Your Profile](https://www.linkedin.com/in/raman-tripathi/-0a6745280/)

---

## 🙏 Acknowledgments

* Express.js – excellent web framework
* MySQL – robust relational database
* Railway – seamless hosting experience
* Joi – comprehensive validation library

---

> ⭐ If you found this project helpful, please give it a star!

