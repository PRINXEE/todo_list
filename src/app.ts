import express from 'express';
import type { Request, Response } from 'express';
import { pool } from './db.js';
import { calculateStatus } from './logic.js';

const app = express();

app.use(express.json());

// CREATE TODO
app.post('/todos', async (req: Request, res: Response) => {
  const { title, description } = req.body;
  const id = crypto.randomUUID(); // Modern Node.js way to generate IDs
  
  try {
    await pool.query(
      'INSERT INTO todos (id, title, description) VALUES (?, ?, ?)',
      [id, title, description]
    );
    res.status(201).json({ id, title, status: 'Coming Up' });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

// READ TODOS (With dynamic status update)
app.get('/todos', async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM todos');
    
    // Apply business logic before sending back
    const processedTodos = rows.map((todo: any) => ({
      ...todo,
      status: calculateStatus(new Date(todo.createdAt), todo.status)
    }));
    
    res.json(processedTodos);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch todos" });
  }
});

// GET A SINGLE TODO BY ID
app.get('/todos/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // 1. Fetch from MySQL
    const [rows]: any = await pool.query('SELECT * FROM todos WHERE id = ?', [id]);
    
    // 2. Check if todo exists
    if (rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    const todo = rows[0];

    // 3. Apply business logic (ensure status is accurate based on time)
    const responseTodo = {
      ...todo,
      status: calculateStatus(new Date(todo.createdAt), todo.status)
    };

    res.json(responseTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// UPDATE A TODO
app.patch('/todos/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  try {
    // Fetch the current todo from MySQL to check its age/status
    const [rows]: any = await pool.query('SELECT * FROM todos WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    const todo = rows[0];

    // Calculate current status based on time (Business Logic)
    const currentComputedStatus = calculateStatus(new Date(todo.createdAt), todo.status);

    // APPLY RESTRICTION: If status is 'Overdue', it cannot be marked 'Done'
    if (status === 'Done' && currentComputedStatus === 'Overdue') {
      return res.status(400).json({ 
        error: "Once a todo becomes Overdue, it cannot be marked as Done." 
      });
    }

    // Update the database
    // We use COALESCE so that if you don't send a field, it keeps the old value
    await pool.query(
      `UPDATE todos SET 
       title = COALESCE(?, title), 
       description = COALESCE(?, description), 
       status = COALESCE(?, status),
       updatedAt = NOW()
       WHERE id = ?`,
      [title, description, status, id]
    );

    res.json({ message: "Todo updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE A TODO
app.delete('/todos/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [result]: any = await pool.query('DELETE FROM todos WHERE id = ?', [id]);

    // affectedRows tells us if anything was actually deleted
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.listen(3000, () => console.log('🚀 Server at http://localhost:3000'));
