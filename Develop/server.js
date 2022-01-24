const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
var storedNotes = require('./db/db.json');

const app = express();

const PORT = process.env.port || 3001;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET route for /notes URL
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// GET request for retrieving preciously stored notes
app.get('/api/notes', (req, res) => {
    res.json(storedNotes);
});

// POST request to add note
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a new note.`);

    const {title, text} = req.body
    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuidv4()
        };

        storedNotes.push(newNote);

        var allNotes = JSON.stringify(storedNotes, null, 2);

        fs.writeFile(`./db/db.json`, allNotes, (err) =>
        err
          ? console.error(err)
          : console.log(
              `Note titled "${newNote.title}" has been written to JSON file`
            )
      );
  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting note');
    }
});

// DELETE request to delete note
app.delete('/api/notes/:id', (req, res) => {
    console.info(`${req.method} request received to delete a note.`);
    
    const id = req.params.id;
    var updatedNotes = storedNotes.filter(item => item.id !== id);
    storedNotes = updatedNotes;
    
    if (id) {
        fs.writeFile(`./db/db.json`, JSON.stringify(updatedNotes, null, 2), (err) =>
        err
          ? console.error(err)
          : console.log(
              `Note with id ${id} has been deleted from JSON file`
            )
      );
  
      const response = {
        status: 'success',
        id: id
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
        res.status(500).json('Error in deleting note');
    }
});


////////////
// const api = require('./public/assets/index');
// app.use('/api', api);
// TODO: HEROKU








// Port listener
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);