require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Client } = require('pg');

const app = express();

app.use(cors());
app.use(express.json());

//connect the database
const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

client.connect()
    .then(() => console.log("connected to database"))
    .catch((err) => console.log("error connecting to database", err.stack));

//get everything from database ans send to client
app.get('/api/todos', async (req, res) => {
    try{
        const result = await client.query("SELECT * FROM todos");
        res.json(result.rows);
    }catch (err){
        console.log("error getting all todos", err.stack);
        res.status(500).send("Error fetching todos");
    }
});

//add a new todo to the database from the client
app.post('/api/todos', async (req, res) => {
    const { title, due_date, priority } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    try{
        const result = await client.query(
            'INSERT INTO todos (title, due_date, priority) VALUES ($1, $2, $3) RETURNING *',
            [title, due_date === '' ? null : due_date, priority]
        );
        res.status(201).json(result.rows);
    }catch (err){
        console.error('Error creating todo:', err);
        res.status(500).json({ error: 'Error creating todo' });
    }
});

//update the data of a todo
app.post('/api/todos/update', async (req, res) => {
    const { id, title, due_date, priority} = req.body;
    console.log("updating todo", id, " title: ", title);
    if (!id) req.status(400).json({error: "ID is required"});

    try{
        const result = await client.query(
            `UPDATE todos SET 
                title = COALESCE($2, title), 
                due_date = COALESCE($3, due_date), 
                priority = COALESCE($4, priority) 
            WHERE id = $1 RETURNING *;`,
            [id, title, due_date === '' ? null : due_date, priority]
        );
        if (result.rowCount==0) {
            req.status(400).json({error: "todo with ID of " + String(id) + " was not found"}); 
            return ;
        }
        res.json(result.rows[0]);
    }catch (err){
        console.error('Error updating todo:', err);
        res.status(500).json({ error: 'Error updating todo' });
    }
});

//delete a todo from the client
app.delete('/api/todos/delete', async (req, res) => {
    console.log("deleting a todo");
    const { id } = req.body;
    console.log("deleting todo", id);
    try{
        const result = await client.query(
            'DELETE FROM todos WHERE id=$1 RETURNING *',
            [id]
        );
        res.json(result.rows[0])
    }catch (err){
        console.log("error deleting todo", err);
        res.status(500).json({ error: "error deleting todo"})
    }
});

//start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("server running on port", PORT);
})