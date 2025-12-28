# Todo Management API

A TypeScript-based REST API to manage todos with time-based status logic.

## Setup Instructions
1. **Database:** Create a MySQL database named `todo_db` in XAMPP.
2. **Table:** Run the SQL command provided in the project folder to create the `todos` table.
3. **Install Dependencies:** `npm install`
4. **Run Development Server:** `npm run dev`

## Design Decisions & Assumptions
- **Time Logic:** I assumed "Overdue" status triggers exactly 24 hours after the `createdAt` timestamp.
- **Status Persistence:** Status is calculated dynamically upon retrieval to ensure that a todo becomes "Overdue" the exact moment it hits the 24-hour mark, without needing a background cron job.
- **Security:** Used `mysql2` with prepared statements to prevent SQL Injection.
- **Business Rule:** Strictly enforced the requirement that Overdue tasks cannot be marked as "Done" via the `PATCH` endpoint.

## Tech Stack
- Node.js & Express
- TypeScript (with tsx runner)
- MySQL (XAMPP)