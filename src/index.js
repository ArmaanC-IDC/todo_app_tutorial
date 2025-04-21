require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Client } = require('pg');

const app = express();

app.use(cors());
app.use(express.json());

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

client.connect()
    .then(() => console.log("connected to database"))
    .catch((err) => console.log("error connecting to database", err.stack));

app.get('/api/todos', async (req, res) => {
    try{
        const result = await client.query("SELECT * FROM todos");
        res.json(result.rows);
    }catch (err){
        console.log("error getting all todos", err.stack);
        res.status(500).send("Error fetching todos");
    }
});

app.post('/api/todos', async (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    try{
        const result = await client.query(
            'INSERT INTO todos (title) VALUES ($1) RETURNING *',
            [title]
        );
        res.status(201).json(result.rows);
    }catch (err){
        console.error('Error creating todo:', err);
        res.status(500).json({ error: 'Error creating todo' });
    }
});

app.post('/api/todos/update', async (req, res) => {
    const { id, title} = req.body;
    if (!id) req.status(400).json({error: "ID is required"});

    try{
        const result = client.query(
            "UPDATE todos SET title = $2 WHERE id = $1 RETURNING *",
            [id, title]
        );
        if (result.rowCount==0) req.status(400).json({error: "todo with ID of " + String(id) + " was not found"});
        res.json(result.rows[0]);
    }catch (err){
        console.error('Error updating todo:', err);
        res.status(500).json({ error: 'Error updating todo' });
    }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("server running on port", PORT);
})