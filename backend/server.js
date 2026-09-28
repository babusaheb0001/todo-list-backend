require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY / SUPABASE_SECRET_KEY in .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// --- API ROUTES ---

// Get all todos
app.get('/api/todos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error fetching todos:", error.message);
    res.status(500).json({ error: "Failed to fetch todos." });
  }
});

// Create a new todo
app.post('/api/todos', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: "Title is required." });
    }

    const { data, error } = await supabase
      .from('todos')
      .insert([{ title: title.trim(), completed: false }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    console.error("Error creating todo:", error.message);
    res.status(500).json({ error: "Failed to create todo." });
  }
});

// Update a todo (title or completed status)
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;
    
    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (completed !== undefined) updates.completed = completed;

    const { data, error } = await supabase
      .from('todos')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;
    if (data.length === 0) return res.status(404).json({ error: "Todo not found." });
    
    res.json(data[0]);
  } catch (error) {
    console.error("Error updating todo:", error.message);
    res.status(500).json({ error: "Failed to update todo." });
  }
});

// Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting todo:", error.message);
    res.status(500).json({ error: "Failed to delete todo." });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
