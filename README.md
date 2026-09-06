# AnnaSeva

# **Location-Based Food Redistribution Platform**

AnnaSeva is a full-stack **MERN application** that connects food providers with volunteers to reduce food wastage and facilitate the redistribution of surplus food.

The platform allows providers to post surplus food and enables volunteers to discover and accept nearby food donations using **location-based geospatial search**.

 **Live Demo:** https://anna-seva-amber.vercel.app
 **GitHub:** https://github.com/bhavyagupta-5/AnnaSeva

---

# Problem Statement

Large quantities of edible food are wasted every day while many people still lack access to sufficient meals.

One of the key challenges is **coordination** — connecting people with surplus food to volunteers who can collect and redistribute it.

AnnaSeva addresses this by providing a platform where:

* Food providers can post surplus food.
* Volunteers can discover nearby donations.
* Volunteers can accept food pickups.
* Food donations can be tracked through their lifecycle.
* Location-based search helps volunteers find relevant donations within a nearby radius.

---

# How AnnaSeva Works

```text
                     FOOD PROVIDER
                          │
                          │ Post surplus food
                          ▼
                   ┌───────────────┐
                   │    ANNA SEVA  │
                   │    PLATFORM   │
                   └───────┬───────┘
                           │
                           │ Find nearby donations
                           ▼
                       VOLUNTEER
                           │
                           │ Accept pickup
                           ▼
                        DELIVERY
                           │
                           ▼
                   FOOD REDISTRIBUTED
```

---

# Key Features

# Authentication & Authorization

* User registration and login
* Password hashing using **bcrypt**
* JWT-based authentication
* Protected API routes
* Role-based authorization
* Separate provider and volunteer workflows

# Food Donation Management

Food providers can:

* Create food donation posts
* Specify food description and quantity
* Share their current location
* View their submitted food posts
* Cancel available donations

# Location-Based Food Discovery

Volunteers can discover available food near their current location.

The application:

1. Gets the volunteer's current coordinates using browser geolocation.
2. Sends latitude and longitude to the backend.
3. Performs a MongoDB geospatial query.
4. Retrieves available food within a **5 km radius**.
5. Displays the results on an interactive map.

MongoDB's `$near` operator and a `2dsphere` index are used for the location-based search.

# Interactive Map

Volunteers can visualize nearby food donations through an interactive map using:

* React Leaflet
* Leaflet
* OpenStreetMap/CARTO map tiles

# Pickup Assignment

Volunteers can accept an available food donation.

The food post is then associated with the volunteer and its status changes:

```text
AVAILABLE
     ↓
ASSIGNED
```

# Delivery Tracking

Food posts support different lifecycle states:

```text
AVAILABLE → ASSIGNED → DELIVERED
```

The backend also supports delivery-related image information.

# Volunteer Rewards

Volunteers receive **10 reward points** after successfully completing a delivery.

This provides a foundation for future gamification features such as leaderboards, badges and volunteer levels.

---

# System Architecture

AnnaSeva follows a **layered client-server architecture**.

```text
                         ┌──────────────────────────┐
                         │          USERS           │
                         │                          │
                         │ Provider │ Volunteer │ NGO│
                         └────────────┬─────────────┘
                                      │
                                      ▼
              ┌──────────────────────────────────────────┐
              │             REACT FRONTEND                │
              │                                          │
              │   React + Vite + Tailwind CSS            │
              │   React Router + Axios                    │
              │   React Leaflet + Leaflet                 │
              │                                          │
              │   ┌─────────┐  ┌──────────────────────┐ │
              │   │  Auth   │  │     Dashboards       │ │
              │   │ Context │  │ Provider / Volunteer  │ │
              │   └─────────┘  └──────────────────────┘ │
              └───────────────────┬──────────────────────┘
                                  │
                             REST API
                              + JWT
                                  │
                                  ▼
              ┌──────────────────────────────────────────┐
              │             EXPRESS BACKEND              │
              │                                          │
              │              API ROUTES                  │
              │                  │                       │
              │                  ▼                       │
              │          AUTH MIDDLEWARE                 │
              │       JWT + Role Authorization           │
              │                  │                       │
              │                  ▼                       │
              │             CONTROLLERS                  │
              │                                          │
              │      ┌────────┬──────────┬─────────┐   │
              │      │ Users  │   Food   │Volunteer│   │
              │      └────────┴──────────┴─────────┘   │
              │                  │                       │
              │                  ▼                       │
              │              MONGOOSE                   │
              └───────────────────┬──────────────────────┘
                                  │
                                  ▼
              ┌──────────────────────────────────────────┐
              │                  MONGODB                  │
              │                                          │
              │   Users │ FoodPosts │ DeliveryLogs       │
              │                                          │
              │          2dsphere Index                  │
              │                 │                        │
              │                 ▼                        │
              │       Geospatial Food Search             │
              │              (5 KM)                      │
              └──────────────────────────────────────────┘
```

---

# Core Technical Flow — Geospatial Food Discovery

One of the main technical components of AnnaSeva is **location-based food discovery**.

```text
                  VOLUNTEER
                      │
                      │ Browser Geolocation API
                      ▼
              Latitude + Longitude
                      │
                      ▼
             GET /volunteer/nearby
                      │
                      ▼
              EXPRESS BACKEND
                      │
                      ▼
             MONGODB GEOSPATIAL
                   QUERY
                      │
                      ▼
             ┌─────────────────┐
             │ 2dsphere Index  │
             └────────┬────────┘
                      │
                      ▼
        Available Food within 5 KM
                      │
                      ▼
             JSON API Response
                      │
                      ▼
              React Frontend
                      │
                      ▼
              Interactive Map
```

Instead of retrieving every food post and calculating distances on the application server, MongoDB performs the proximity search using its geospatial query capabilities.

This reduces unnecessary data processing and allows the database to return only relevant nearby food posts.

---

# Authentication Architecture

```text
                   USER
                    │
                    ▼
              Login / Register
                    │
                    ▼
             Express Backend
                    │
                    ▼
           Verify Credentials
                    │
                    ▼
             bcrypt Password
               Verification
                    │
                    ▼
                JWT Token
                    │
                    ▼
             React Frontend
                    │
                    ▼
        Authorization Header
             Bearer <JWT>
                    │
                    ▼
          Authentication Middleware
                    │
                    ▼
           Role Authorization
                    │
             ┌──────┴──────┐
             ▼             ▼
          Provider      Volunteer
```

Passwords are hashed before storage, while JWTs are used to authenticate protected requests.

---

# Food Donation Lifecycle

```text
                         ┌─────────────┐
                         │  AVAILABLE  │
                         └──────┬──────┘
                                │
                         Volunteer accepts
                                │
                                ▼
                         ┌─────────────┐
                         │   ASSIGNED  │
                         └──────┬──────┘
                                │
                         Delivery completed
                                │
                                ▼
                         ┌─────────────┐
                         │  DELIVERED  │
                         └─────────────┘
```

A provider can also cancel an available donation:

```text
AVAILABLE → CANCELLED
```

---

# Tech Stack

## Frontend

| Technology    | Purpose                     |
| ------------- | --------------------------- |
| React.js      | User interface              |
| Vite          | Development & build tooling |
| React Router  | Client-side routing         |
| Tailwind CSS  | Styling                     |
| Axios         | API communication           |
| React Leaflet | Interactive maps            |
| Leaflet       | Map rendering               |
| Lucide React  | UI icons                    |

## Backend

| Technology | Purpose                   |
| ---------- | ------------------------- |
| Node.js    | JavaScript runtime        |
| Express.js | REST API                  |
| MongoDB    | Database                  |
| Mongoose   | ODM                       |
| JWT        | Authentication            |
| bcrypt     | Password hashing          |
| CORS       | Cross-origin requests     |
| dotenv     | Environment configuration |

## Deployment

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** MongoDB / MongoDB Atlas

---

# Project Structure

```text
AnnaSeva/
│
├── AnnaSeva_Backend/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── foodController.js
│   │   ├── userController.js
│   │   └── volunteerController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── foodPost.js
│   │   └── deliveryLog.js
│   │
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── foodRoutes.js
│   │   └── volunteerRoutes.js
│   │
│   ├── utils/
│   │   └── generatetoken.js
│   │
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── AnnaSeva_Frontend/
│   │
│   └── Frontend/
│       ├── public/
│       ├── src/
│       │   ├── api/
│       │   ├── assets/
│       │   ├── components/
│       │   ├── context/
│       │   ├── pages/
│       │   ├── App.jsx
│       │   └── main.jsx
│       │
│       ├── package.json
│       ├── vite.config.js
│       └── vercel.json
│
└── README.md
```

---

# Core REST APIs

## Authentication

| Method | Endpoint              | Description          |
| ------ | --------------------- | -------------------- |
| `POST` | `/api/users/register` | Register a new user  |
| `POST` | `/api/users/login`    | Login and obtain JWT |

## Food Provider

| Method | Endpoint               | Description               |
| ------ | ---------------------- | ------------------------- |
| `POST` | `/api/food/create`     | Create food donation      |
| `GET`  | `/api/food/my-posts`   | Get provider's food posts |
| `POST` | `/api/food/cancel/:id` | Cancel a food donation    |

## Volunteer

| Method | Endpoint                     | Description                |
| ------ | ---------------------------- | -------------------------- |
| `GET`  | `/api/volunteer/nearby`      | Find nearby available food |
| `POST` | `/api/volunteer/accept/:id`  | Accept a food pickup       |
| `POST` | `/api/volunteer/deliver/:id` | Mark delivery as completed |

---

# Database Design

### User

```text
User
├── name
├── email
├── password
├── phoneNo
├── address
├── city
├── state
├── country
├── pincode
├── profilePicture
├── role
└── rewardPoints
```

### FoodPost

```text
FoodPost
├── provider
├── description
├── quantity
├── expiryTime
├── images
├── location
│   ├── type
│   └── coordinates
├── status
├── assignedVolunteer
├── pickupImage
├── deliveryImage
├── cancelReason
└── timestamps
```

The `location` field uses GeoJSON Point data and a MongoDB `2dsphere` index to support geospatial queries.

### DeliveryLog

```text
DeliveryLog
├── foodPost
├── volunteer
├── ngo
├── pickupImage
├── deliveryImage
├── status
└── timestamps
```

---

# Getting Started

## Prerequisites

Make sure you have:

* Node.js
* npm
* MongoDB / MongoDB Atlas
* Git

## 1. Clone

```bash
git clone https://github.com/bhavyagupta-5/AnnaSeva.git

cd AnnaSeva
```

---

## 2. Backend Setup

```bash
cd AnnaSeva_Backend

npm install
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Start the backend:

```bash
npm start
```

---

## 3. Frontend Setup

Open another terminal:

```bash
cd AnnaSeva_Frontend/Frontend

npm install

npm run dev
```

---

# Example User Journey

# Provider

```text
Register
   ↓
Login
   ↓
Provider Dashboard
   ↓
Allow Location Access
   ↓
Enter Food Details
   ↓
Create Food Post
   ↓
Donation becomes AVAILABLE
```

# Volunteer

```text
Register
   ↓
Login
   ↓
Volunteer Dashboard
   ↓
Allow Location Access
   ↓
Find Nearby Food
   ↓
View Donations on Map
   ↓
Accept Pickup
   ↓
Donation becomes ASSIGNED
   ↓
Complete Delivery
   ↓
Donation becomes DELIVERED
   ↓
Earn Reward Points
```

---

# Technical Challenges & Solutions

| Challenge                                  | Solution                             |
| ------------------------------------------ | ------------------------------------ |
| Finding relevant donations near volunteers | MongoDB geospatial `$near` query     |
| Efficient location searching               | `2dsphere` index on GeoJSON location |
| Protecting user accounts                   | JWT authentication + bcrypt          |
| Different user capabilities                | Role-based authorization middleware  |
| Visualizing nearby donations               | React Leaflet + Leaflet              |
| Tracking donation progress                 | Food post status lifecycle           |
| Encouraging volunteer participation        | Reward point system                  |

---

# Key Learning Outcomes

Building AnnaSeva provided practical experience with:

* Full-stack MERN development
* REST API development
* JWT authentication
* Password hashing
* Role-based access control
* MongoDB & Mongoose
* Geospatial database queries
* GeoJSON
* React state management
* React Router
* Axios
* Browser Geolocation API
* Interactive maps
* Frontend-backend integration
* Full-stack deployment

---

# Future Improvements

The current architecture provides a foundation for several improvements:

# NGO Workflow

* Complete NGO dashboard
* NGO food requirements
* Distribution management
* Volunteer coordination

# Notifications

* New nearby donation alerts
* Pickup notifications
* Delivery confirmation
* Food expiry reminders

# Smarter Routing

* Route optimization
* Estimated travel time
* Automatic volunteer assignment
* Multiple pickup optimization

# Analytics

* Total food rescued
* Total deliveries
* Active volunteers
* Food waste prevented
* Geographic impact

# Gamification

* Volunteer leaderboard
* Achievement badges
* Volunteer levels
* Contribution history

---

# Why This Project?

AnnaSeva is more than a basic CRUD application.

It combines:

```text
Authentication
      +
Role-Based Authorization
      +
REST APIs
      +
MongoDB
      +
Geospatial Queries
      +
Browser Geolocation
      +
Interactive Maps
      +
Real-World Workflow
      +
Deployment
```

The project demonstrates how full-stack technologies can be combined to solve a **real-world coordination and food-waste problem**.

---

# Project Highlights

```text
✔ MERN Stack
✔ JWT Authentication
✔ bcrypt Password Hashing
✔ Role-Based Authorization
✔ MongoDB Geospatial Search
✔ 2dsphere Index
✔ 5 KM Nearby Food Discovery
✔ Browser Geolocation
✔ Interactive Map
✔ Volunteer Pickup Assignment
✔ Delivery Tracking
✔ Volunteer Reward Points
✔ RESTful APIs
✔ Full-Stack Deployment
```

---

# Vision

> **Reduce food waste by making surplus food easier to discover, collect and redistribute.**

# AnnaSeva

**Share Food. Reduce Waste. Serve Communities.**
