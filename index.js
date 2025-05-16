require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./db.js');

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.status(200).json({ message: "API Working" });
});

app.get('/tasks', (req, res) => {
    const sql = 'SELECT * FROM tasks';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error: ', err);
            return res.status(500).json({message: "Error while fetching database"});
        }
        res.status(200).json(results);
    });
});

app.get('/tasks/:id', (req, res) => {
    const { id } = req.params;
    if (isNaN(id)) {
        return res.status(400).json({message: "Invalid ID format"});
    }
    const sql = 'SELECT * FROM tasks WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Error: ", err);
            return res.status(500).json({message: "Database error" });
        }
        if (results.length === 0) {
            return res.status(404).json({message: "Task not found" });
        }
        res.status(200).json(results[0]);
    });
});

app.post('/tasks', (req, res) => {
    const {id, title, description} = req.body;
    const sql = 'INSERT INTO tasks (id, title, description) VALUES (?, ?, ?)';
    db.query(sql, [id, title, description], (err, results) => {
        if(err) {
            console.error('Err: ', err);
            res.status(400).json({message: "Error while creating new task"});
        }
        console.error(`New task added. ${title} - ${description}`);
        res.status(201).json({message: "Task created succesfully"});
    });
});


app.put('/tasks', (req, res) => {
    const {id, title, description} = req.body;
    if(!id || isNaN(id)) {
        return res.status(400).json({message: "Invalid or missing ID"});
    }
    const sql = 'UPDATE tasks SET title = ?, description = ? WHERE id = ?';
    db.query(sql, [title, description, id], (err, results) => {
        if(err){
            console.error("Error: ", err);
            return res.status(500).json({message: "Error updating task"});
        }
        if(results.affectedRows === 0){
            return res.status(404).json({message: "Task not found"});
        }
        res.status(200).json({message: "Task updated successfully"});
    });
});

app.delete('/tasks', (req, res) => {
    const {id} = req.body;
    const sql = 'DELETE FROM tasks WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if(err) {
            console.error("Error: ", err);
            return res.status(500).json({message: "Error while deleting task"});
        }
        res.status(200).json({message: "Task deleted succesfully"});
    });
});

app.use((req, res) => {
    res.status(404).json({message: "URL not found" });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
});
