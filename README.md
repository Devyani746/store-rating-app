# Store Rating Web Application

A full-stack role-based store rating platform built with Express.js, React.js, and MySQL.

## Tech Stack
- **Frontend:** React.js, React Router DOM, Axios, Vite
- **Backend:** Node.js, Express.js, JWT, bcryptjs, express-validator
- **Database:** MySQL

## Features by Role
- **System Administrator:** 
  - Manage users (Admin, Normal User, Store Owner) and Stores.
  - View real-time analytics (Total Users, Stores, Ratings).
  - Search, filter by role, and sort listings.
- **Normal User:**
  - Account registration and login.
  - Browse stores, search by name/address, sort lists.
  - Submit and modify 1–5 star ratings (1 rating per store constraint).
  - Update password.
- **Store Owner:**
  - View store average rating.
  - View table of users who submitted ratings.
  - Update password.

## Validation Rules
- **Name:** 20–60 characters.
- **Address:** Up to 400 characters.
- **Password:** 8–16 characters, $\ge$ 1 uppercase letter, $\ge$ 1 special character.
- **Email:** Standard email format validation.

## Local Setup

### 1. Database Setup
Execute the following in MySQL:
```sql
CREATE DATABASE store_rating_db;
USE store_rating_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(400) NOT NULL,
    role ENUM('ADMIN', 'USER', 'OWNER') NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address VARCHAR(400) NOT NULL,
    owner_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    store_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_store (user_id, store_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);