# Store Rating Web Application

A full-stack web application with role-based access control (System Administrator, Normal User, Store Owner) where users can discover and rate stores, administrators manage users and listings, and store owners analyze performance metrics.

## 🚀 Live Demo
- **Frontend App:** [https://store-rating-app-swart-nine.vercel.app](https://store-rating-app-swart-nine.vercel.app)
- **Backend API:** [https://store-rating-app-1-hnw3.onrender.com/api](https://store-rating-app-1-hnw3.onrender.com/api)

---

## 🛠 Tech Stack
- **Frontend:** React.js (Vite), React Router v6, Axios, Lucide Icons, Modern CSS
- **Backend:** Node.js, Express.js (REST API, JWT Authentication, bcryptjs)
- **Database:** TiDB Cloud Serverless (MySQL Compatible) via TLS/SSL Connection Pool
- **Hosting:** Vercel (Frontend SPA), Render (Backend Web Service)

---

## 🔑 Pre-Configured Demo Credentials

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@storerating.com` | `Admin@12345` | Manage users, stores, global stats, sorting/filtering |
| **Store Owner** | `owner@storerating.com` | `Owner@12345` | View store average rating, list of raters |
| **Normal User** | *Register via /signup* | *Min 8-16 chars* | Browse stores, submit & modify 1-5 star ratings |

---

## ✨ Features & Constraints
- **Role-Based Routing:** Dedicated UI views and backend middleware protection per role.
- **Single-Rating Constraint:** Enforced via `UNIQUE KEY (user_id, store_id)` so raters can only submit one rating per store and subsequently edit it.
- **Strict Validations:**
  - Name: 20–60 characters
  - Address: Max 400 characters
  - Password: 8–16 characters with at least one uppercase letter and one special character
  - Email: Standard RFC email formatting
- **Table Sorting & Search:** Ascending/descending column sorting and live multi-field filtering.