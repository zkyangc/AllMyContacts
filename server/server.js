const path = require('path');
const express = require('express');
//const connectDB = require('./config/db');

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
            full_name TEXT NOT NULL,
            phone TEXT,
            email TEXT,
            CONSTRAINT same_phone_no UNIQUE (phone)
        );
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS addresses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            contact_id INTEGER,
            street TEXT NOT NULL,
            city TEXT NOT NULL,
            state TEXT NOT NULL,
            zip TEXT NOT NULL,
            country TEXT NOT NULL,
            FOREIGN KEY (contact_id) REFERENCES contacts(id),
            CONSTRAINT identical UNIQUE (contact_id, street,city,state,zip,country)
        );
    `)
  });
  
app.use(express.json());

// retrieve all contacts
app.get('/api/contacts', (req, res) => {
    db.all('SELECT * FROM contacts', (err, rows) => {
    if (err) {
        console.log(err)
        return res.status(500).json({ error: err.message });
    }
    res.json(rows);
    });
});

// retrieve all addresses with contact_id
app.get('/api/addresses', (req, res) => {
    db.all('SELECT * FROM addresses WHERE contact_id = ?', req.query.cid, (err, rows) => {
    if (err) {
        return res.status(500).json({ error: err.message });
    }
    res.json(rows);
    });
});

// update a contact by id
app.put('/api/contacts/:id', (req, res) => {
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

// delete a contact by id
app.delete('/api/contacts/:id', (req, res) => {
    db.run('DELETE FROM contacts WHERE id = ?', req.params.id, function(err) {
    if (err) {
        return res.status(400).json({ error: err.message });
    }
    res.json({ message: 'Deleted' });
    });
});

const bodyParser = require("body-parser");
const multer = require("multer");
const vcard = require("vcard-json");

app.use(bodyParser.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}.vcf`);
    },
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
    const file = req.file;
    vcard.parseVcardFile(file.path, (err, data) => {
        if (err) {
            return res.status(500).send(err);
        }
        db.serialize(() => {
            // must not use a lambda function, otherwise this.lastID will be undefined
            data.forEach(function (contact) { 
                try{
                    db.run(`INSERT INTO contacts (full_name, phone, email) VALUES (?, ?, ?);`, [
                        contact.fullname, 
                        contact.phone.map(phone => phone.value).join(", "),
                        contact.email.map(email => email.value).join(", "),  
                    ], function() {
                        const contact_id = this.lastID;
                        const insertAddrStmt = db.prepare(
                            `INSERT INTO addresses (contact_id, street, city, state, country, zip) VALUES (?, ?, ?, ?, ?, ?);`
                        );
                        contact.addr.forEach(function (addr) {
                            console.log(contact_id);
                            insertAddrStmt.run(contact_id, addr.street, addr.city, addr.state, addr.country, addr.zip);
                        }) 
                        insertAddrStmt.finalize();
                    })
                } catch(err) {
                    console.error(err);
                }
                
            });            
        });
        return res.send("Import successful");
    });
});
  
// start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
