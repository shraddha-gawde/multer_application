const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require("cors")
const app = express();
const port = 8080;
app.use(cors())
// Set up storage for uploaded files using multer
app.use(express.static('public')); 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const fileName = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const upload = multer({ storage });

// Serve the HTML form for uploading files
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  res.send('File uploaded successfully.');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
