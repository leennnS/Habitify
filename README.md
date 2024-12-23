# Habit-Tracker

> The Habit Tracker API allows users to track, manage, and improve their habits by logging daily tasks, setting goals, and earning rewards. It enables users to create personalized habits, track their progress, and maintain streaks. The API provides functionality for users to view and update their profiles, including points, streaks, and badges. This tool helps users build better habits by offering motivation through rewards and tracking, making it ideal for anyone looking to improve personal productivity and well-being.

## Features
**Streaks and Badges:** Earn streaks for consecutive days of habit completion and unlock badges as cool rewards for reaching milestones.
**Point System:** Collect points every time you complete a habit, and use them to unlock cool avatar items and customization options.
**Personalized Habit Creation:** Create your own custom habits or Dailies making it easy to track anything important to you.
**Task Completion Logging:** Every task completion is recorded, keeping you motivated and letting you see your improvement over time

## Table of Contents

1. [Installation](#installation)
2. [Setup](#setup)
3. [Usage](#usage)
---



This Node.js API allows users to track and manage their habits, earn points, maintain streaks, and unlock badges. Below is a guide on how to set up, run, and deploy the API.

## Getting Started

Follow the instructions below to get the API up and running on your local machine.

### Prerequisites
Make sure you have the following installed:
- **Node.js** version >= 22.0
- **npm** version >= 6.0
- **MySQLDB**
  
## Dependencies 
- bcrypt
- dotenv
- express
- express-validator
- moment
- mysql2
- nodemon
  
### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/leennnS/habit-tracker.git
   ```

2. Navigate to the project folder:

   ```bash
   cd web-project-habitTracker
   ```

3. Install dependencies:

   ```bash
   npm install
   ```
## Setup

### Configuration

- **Environment Variables**: Configure environment variables for use (e.g., `DB_HOST`).
  
### Example `.env` File:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_PORT=3307
DB_NAME=webdb
```

## Usage

Once the application is set up, you can access it in your browser at `http://localhost:3001`.

### Available Endpoints


Here are the endpoints from the routes you provided:


- GET /badges: Fetch all badges.
- GET /badges/: Fetch a specific badge by its ID.
- GET /badges/users/
: Fetch all badges earned by a specific user.
- POST /badges: Create a new badge.
- PUT /badges/
: Update a badge by its ID.
- DELETE /badges/
: Delete a badge by its ID.
- GET /dailies: Fetch all daily tasks.
- POST /dailies: Create a new daily task.
- GET /friendships/
/search: Search for a friend by user ID.
- GET /friendships/friends/
: Get the list of friends for a given user.
- GET /friendships/pending/
: Get the list of pending friend requests for a user.
- POST /friendships: Create a new friendship request.
- PUT /friendships/
: Update the status of a friendship (accept/reject).
- POST /friendships/sendfriendrequest: Send a friendship request.
- GET /habits/users/
: Fetch all habits for a specific user.
