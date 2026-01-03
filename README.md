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

### 4. Screenshots
```
## 📸 Screenshots / Demo

**Landing Page**  
![Landing Page](./screenshots/Landing.png)

**Login Page**  
![Login Page](./screenshots/Login.png)

**SignUp Page**  
![SignUp Page](./screenshots/SignUp.png)

**Admin Dashboard**  
![Admin Dashboard](./screenshots/AdminDashboard.png)

**Admin Adding User**  
![Admin Adding User](./screenshots/AdminAddingtheUser.png)

**Admin Editing User**  
![Admin Editing User](./screenshots/AdminEditingTheUserDetails.png)

**Admin Updating Roles**  
![Admin Updating Roles](./screenshots/AdminUpdatingTheRoles.png)

**User Dashboard**  
![User Dashboard](./screenshots/UserDashboard.png)

**User Profile Update**  
![User Profile Update](./screenshots/UserProfileUpdate.png)

**User Changing Password**  
![User Changing Password](./screenshots/UserChangingThePassword.png)


```
### 5.License
```
MIT License

Copyright (c) 2026 Ronak Malpani

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```


### 6. Author
```
Ronak Malpani

B.Tech CSE
```