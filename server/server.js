const express = require('express');
//const connectDB = require('./config/db');
const path = require('path');

const sqlite3 = require('sqlite3').verbose();

const app = express();
var cors = require('cors')
app.use(cors()) 

const db = new sqlite3.Database('contacts.db');

// create the contacts table if it doesn't exist
// aligned with VCard v4.0 as in https://en.wikipedia.org/wiki/VCard
db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        nickname TEXT,
        company TEXT,
        mobile TEXT,
        tel TEXT,
        email TEXT,
        address TEXT 
      )
    `);
  });
  
  app.use(express.json());
  
  // endpoint to retrieve all contacts
  app.get('/contacts', (req, res) => {
    db.all('SELECT * FROM contacts', (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  });
  
  // endpoint to add a new contact
  app.post('/contacts', (req, res) => {
    const { name, phone } = req.body;
    db.run(
      'INSERT INTO contacts (name, phone) VALUES (?, ?)',
      [name, phone],
      function(err) {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        res.json({ id: this.lastID, name, phone });
      }
    );
  });
  
  // endpoint to update a contact by id
  app.put('/contacts/:id', (req, res) => {
    const { name, phone } = req.body;
    db.run(
      'UPDATE contacts SET name = ?, phone = ? WHERE id = ?',
      [name, phone, req.params.id],
      function(err) {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        res.json({ name, phone });
      }
    );
  });
  
  // endpoint to delete a contact by id
  app.delete('/contacts/:id', (req, res) => {
    db.run('DELETE FROM contacts WHERE id = ?', req.params.id, function(err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ message: 'Deleted' });
    });
  });
  
  // start the server
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });