# User Management System (Role-Based Dashboard)

![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/Frontend-React.js-blue)
![Node](https://img.shields.io/badge/Backend-Node.js-green)
![Database](https://img.shields.io/badge/Database-MySQL-orange)

A full-stack User Management System built as part of a technical round assignment. The application demonstrates authentication, authorization, and role-based access control (RBAC) using modern web technologies.

---

## Table of Contents
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Demo Credentials](#demo-credentials-for-testing)
- [Screenshots](#screenshots--demo)
- [License](#license)

---

## Tech Stack

| Area | Technologies |
| :--- | :--- |
| Frontend | React.js, React Router, Axios, CSS3 (Responsive) |
| Backend | Node.js, Express.js, JWT, Bcrypt |
| Database | MySQL |

---

## Features

### Authentication
* Secure Login & Registration
* JWT-based session management
* Bcrypt password hashing for security

### Role-Based Access Control (RBAC)

| Role         | Permissions                                                                                   | 
| -----------  | --------------------------------------------------------------------------------------------- |
| User         | • View Profile <br> • Update Profile <br> • Change Password                                   |
| Admin        | • All User privileges<br>                                                                     |
|              | •View all users <br>                                                                          |
|              | •Create/Edit users <br>                                                                       |
|              | • Activate/Deactivate accounts<br>                                                            |
| Super Admin  | • All Admin privileges <br> • Manage Roles (Promote/Demote Users & Admins)                    |

###  Demo Credentials (for testing)
| Role        | Email                                               | Password      |
| ----------- | --------------------------------------------------- | ------------- |
| Super Admin | [superadmin@gmail.com](mailto:superadmin@gmail.com) | SuperAdmin123 |
| Admin       | [admin@gmail.com](mailto:admin@gmail.com)           | Admin@123     |
| User        | [user@gmail.com](mailto:user@gmail.com)             | Userst@123    |


## Project Structure

```text
User Management System
├── client
│   ├── public
│   └─ src
│      ├── api           # Axios setup
│      ├── components    # Reusable UI (Sidebar, Modal, etc.)
│      ├── pages         # Dashboard views (Admin, User, Login)
│      └─ styles         # CSS Modules
│
├── server
│   ├── config           # DB connection & hashing logic
│   ├── controllers      # Business logic (Auth, User operations)
│   ├── middleware       # JWT Verification & Admin Checks
│   └─ routes            # API Endpoints
│
├── screenshots          # Images for README
└── README.md

```
## Setup Instructions

### 1. Clone the repository
```
git clone https://github.com/Ronak-malpani/user-dashboard-app.git
cd user-dashboard-app
```

### 2. Backend Setup
```
Install dependencies and configure the environment:

cd server
npm install
```

### Create a .env file in the server/ folder:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=user_management
JWT_SECRET=your_secret_key

Run the server: node server.js
```

### 3. Frontend Setup
```
Open a new terminal window:

cd client
npm install
npm start

The app will run on http://localhost:3000
```