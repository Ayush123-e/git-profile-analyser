# GitHub Profile Analyzer API

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018.0.0-blue.svg)](https://nodejs.org)
[![Express.js](https://img.shields.io/badge/framework-Express.js-lightgrey.svg)](https://expressjs.com)
[![Sequelize ORM](https://img.shields.io/badge/orm-Sequelize%20(MySQL)-blue.svg)](https://sequelize.org)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()

A robust, enterprise-grade RESTful API built with Node.js, Express.js, and MySQL (via Sequelize ORM) that fetches public GitHub profile data, computes deep analytical insights (such as star counts, fork counts, and top programming languages), and caches/synchronizes the results in a relational database.

---

## Features

- **Profile Analysis**: Fetches public user details and repositories from the official GitHub Public API.
- **Relational Data Caching**: Securely caches and updates profile insights inside a MySQL database to bypass API rate limits.
- **Deep Code Insights**: Automatically computes aggregate repository metrics:
  - Total repository stars count.
  - Total repository forks count.
  - Top 5 programming languages based on repository usage frequency.
- **Full CRUD Support**: Complete control over analyzed profiles (Create/Analyze, Read All, Read Single, and Delete).
- **Global Error Handling**: Standardized JSON error response formatting for validation, database unique constraints, and missing external resource errors.

---

## Tech Stack

- **Runtime Environment**: Node.js
- **Web Framework**: Express.js
- **Database ORM**: Sequelize ORM
- **Database Driver**: MySQL2 (MySQL)
- **HTTP Client**: Axios (for GitHub API interaction)
- **Environment Management**: Dotenv
- **Process Manager**: Nodemon (development auto-reload)

---

## Project Structure

```text
git-profile-analyser/
├── config/
│   └── database.js          # Sequelize connection and pooling config
├── controllers/
│   └── profileController.js # API controllers (analyze, get list, get detail, delete)
├── middleware/
│   └── errorHandler.js      # Global JSON error handling middleware
├── models/
│   ├── index.js             # Sequelize instance and models manager
│   └── profile.js           # Profile schema definition mapped to github_profiles
├── routes/
│   └── profileRoutes.js     # Express routes definition
├── services/
│   └── githubService.js     # External Axios client wrapper & metrics computation
├── .env                     # Local environment variables (ignored)
├── .env.example             # Configuration template
├── .gitignore               # Ignored directories and files
├── package.json             # Manifest scripts and dependencies
├── schema.sql               # Pure SQL initialization schema script
└── server.js                # Server bootstrapper & DB sync entry point
```

---

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Returns server health status and MySQL database connection status. |
| `POST` | `/api/analyze/:username` | Fetches fresh profile details from GitHub, updates/inserts MySQL record, and returns the result. |
| `GET` | `/api/profiles` | Returns a summary list of all stored profiles (limited to: `username`, `followers`, `publicRepos`). |
| `GET` | `/api/profile/:username` | Returns the complete, detailed database record of a single analyzed user. |
| `DELETE` | `/api/profile/:username` | Removes a specific user's analysis cache from the database. |

---

## Environment Variables

Create a `.env` file at the root of the project and define the following variables:

```env
# Server Configurations
PORT=5001
NODE_ENV=development

# MySQL Database Configurations
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=github_profile_analyser

# GitHub Token Configuration (Optional but recommended to bypass rate limits)
# Create a Personal Access Token at https://github.com/settings/tokens
GITHUB_TOKEN=your_github_personal_access_token
```

---

## Installation & Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/Ayush123-e/git-profile-analyser.git
cd git-profile-analyser
```

### 2. Install dependencies
```bash
npm install
```

### 3. Initialize the database
Log in to your MySQL command line or client and execute:
```sql
CREATE DATABASE github_profile_analyser;
```
*(Alternatively, you can run the SQL script provided in `schema.sql` to initialize both the database and the required table structures).*

### 4. Setup your configuration
Copy `.env.example` to `.env` and configure your database host, port, username, password, and optionally a GitHub Token.
```bash
cp .env.example .env
```

### 5. Run the application
* **For Development (with Nodemon auto-restart)**:
  ```bash
  npm run dev
  ```
* **For Production**:
  ```bash
  npm start
  ```

---

## Live Deployment
The production-ready API is fully containerized and configured for deployment on cloud platforms such as Render, Heroku, or AWS ECS, utilizing environment variables injected during runtime.
