# Modern To-Do List App

A modern, responsive To-Do List web application built with HTML, CSS, JavaScript, Node.js, Express, and Supabase.

## Features
- Add, edit, delete tasks
- Mark tasks as completed/pending
- Filter tasks (All, Pending, Completed)
- Search tasks
- Responsive and attractive UI with dark mode styling
- Supabase PostgreSQL database integration
- Secure backend structure (secrets not exposed in frontend)

## Prerequisites
1. [Node.js](https://nodejs.org/) installed on your machine.
2. A [Supabase](https://supabase.com/) account.

## Setup Instructions

### 1. Database Setup (Supabase)
1. Go to Supabase and create a new project.
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Open the `database.sql` file in this project and copy its contents.
4. Paste and run the SQL code in the Supabase SQL Editor. This will create the `todos` table.
5. Go to **Project Settings -> API** in Supabase. Find your **Project URL** and **anon public** key.

### 2. Local Project Setup
1. Open your terminal and navigate to the project directory:
   ```bash
   cd c:/TODOO
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Create the environment file:
   - Rename `.env.example` to `.env`
   - Open `.env` and fill in your Supabase credentials:
     ```env
     SUPABASE_URL=your_project_url_here
     SUPABASE_ANON_KEY=your_anon_key_here
     PORT=3000
     ```

### 3. Run the Application
Start the server by running:
```bash
npm start
```
*For development with auto-restart on changes, use `npm run dev`.*

The application will be running at [http://localhost:3000](http://localhost:3000). Open this link in your browser to start managing your tasks!
