const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
// const api = require('')
const storedNotes = require('./db/db.json');

const app = express();

const PORT = process.env.port || 3001;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET route for /notes URL
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// GET request for retrieving notes
app.get('/api/notes', (req, res) => {
    res.json(storedNotes);
});

// POST request to add note
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a new note.`);
    // access note data
    // const newNote = req.body;
    // create (persist data)
    // const storedNotes = 
    // access new note data from req
    // push to existing list of notes
    // rewrite db.json with old nad new note
    const {title, text} = req.body
    if (title, text) {
        const newNote = {
            title,
            text,
            note_id: uuidv4()
        };

        storedNotes.push(newNote);

        const allNotes = JSON.stringify(storedNotes, null, 2);

        fs.writeFile(`./db/db.json`, allNotes, (err) =>
        err
          ? console.error(err)
          : console.log(
              `Note titled ${newNote.title} has been written to JSON file`
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


////////////

// const path = require('path');
// const api = require('./public/assets/index');




// app.use('/api', api);








// Port listener
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);