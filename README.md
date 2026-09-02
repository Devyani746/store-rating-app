# Store Rating Web Application

A full-stack web application with role-based access control (System Administrator, Normal User, Store Owner) where users can discover and rate stores, administrators manage users and listings, and store owners analyze performance metrics[cite: 1, 5].

---

## 🚀 Live Demo
- **Frontend App:** [https://store-rating-app-swart-nine.vercel.app](https://store-rating-app-swart-nine.vercel.app)
- **Backend API:** [https://store-rating-app-1-hnw3.onrender.com/api](https://store-rating-app-1-hnw3.onrender.com/api)

---

## 🛠 Tech Stack
- **Frontend:** React.js (Vite), React Router v6, Axios, Lucide Icons, Modern CSS[cite: 1, 3]
- **Backend:** Node.js, Express.js (REST API, JWT Authentication, bcryptjs)[cite: 1, 3]
- **Database:** TiDB Cloud Serverless (MySQL Compatible) via TLS/SSL Connection Pool[cite: 1, 3]
- **Hosting:** Vercel (Frontend SPA), Render (Backend Web Service)

---

## 📐 Architecture & System Design

### 1. 3-Tier System Architecture
```mermaid
flowchart TD
    subgraph Client_Layer ["Client Layer (Vercel)"]
        React["React.js SPA (Vite)"]
        UI1["Auth (Login / Signup)"]
        UI2["Admin Dashboard & User Management"]
        UI3["Store Owner Dashboard & Metrics"]
        UI4["User Store Rating UI (1-5 Stars)"]
        React --- UI1
        React --- UI2
        React --- UI3
        React --- UI4
    end

    subgraph App_Layer ["Application Layer (Render)"]
        Express["Node.js + Express REST API"]
        AuthMiddleware["JWT Verification & Role Access"]
        Controllers["Controllers (Admin, Store, Rating)"]
        Express --> AuthMiddleware --> Controllers
    end

    subgraph Data_Layer ["Data Layer (TiDB Cloud)"]
        TiDB[("TiDB Serverless (MySQL Engine)")]
        T_Users[("users")]
        T_Stores[("stores")]
        T_Ratings[("ratings")]
        TiDB --- T_Users
        TiDB --- T_Stores
        TiDB --- T_Ratings
    end

    Client_Layer -- "HTTPS / REST API (Bearer JWT)" --> App_Layer
    App_Layer -- "Parameterized SQL (mysql2/promise + SSL)" --> Data_Layer
```

### 2. Entity-Relationship Diagram (ERD)
```mermaid
erDiagram
    USERS ||--o{ STORES : "owns (role=OWNER)"
    USERS ||--o{ RATINGS : "submits (role=USER)"
    STORES ||--o{ RATINGS : "receives"

    USERS {
        int id PK "Auto Increment"
        string name "20-60 chars"
        string email UK "Valid format"
        string password "Hashed (bcrypt)"
        string address "Max 400 chars"
        enum role "ADMIN, USER, OWNER"
        datetime created_at
    }

    STORES {
        int id PK "Auto Increment"
        string name "20-60 chars"
        string email "Valid format"
        string address "Max 400 chars"
        int owner_id FK "References USERS(id)"
        datetime created_at
    }

    RATINGS {
        int id PK "Auto Increment"
        int user_id FK "References USERS(id)"
        int store_id FK "References STORES(id)"
        int rating "Range 1 - 5"
        datetime created_at
        datetime updated_at
    }
```

---

## 🔑 Pre-Configured Demo Credentials

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@storerating.com` | `Admin@12345` | Manage users, stores, global stats, sorting/filtering[cite: 1, 5] |
| **Store Owner** | `owner@storerating.com` | `Owner@12345` | View store average rating, list of raters[cite: 1, 5] |
| **Normal User** | *Register via /signup* | *Min 8-16 chars* | Browse stores, submit & modify 1-5 star ratings[cite: 1, 5] |

---

## ✨ Features & Constraints
- **Role-Based Routing:** Dedicated UI views and backend middleware protection per role.
- **Single-Rating Constraint:** Enforced via `UNIQUE KEY (user_id, store_id)` so raters can only submit one rating per store and subsequently edit it.
